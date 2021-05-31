import { useVideos } from '@/api/hooks'
import { useJoystream, useAuthorizedUser, useTransactionManager } from '@/hooks'
import { removeVideoFromCache } from '@/utils/cachingAssets'
import { useDialog } from './useDialog'

export const useDeleteVideo = () => {
  const { joystream } = useJoystream()
  const { handleTransaction } = useTransactionManager()
  const { activeMemberId, activeChannelId } = useAuthorizedUser()
  const [openDeleteVideoDialog, closeDeleteVideoDialog] = useDialog()

  const { refetchCount: refetchVideosCount, client } = useVideos({
    where: {
      channelId_eq: activeChannelId,
    },
  })

  const deleteVideo = (videoId: string, onDeleteVideo?: () => void) => {
    openDeleteVideoDialog({
      title: 'Delete this video?',
      exitButton: false,
      description:
        'You will not be able to undo this. Deletion requires a blockchain transaction to complete. Currently there is no way to remove uploaded video assets.',
      onPrimaryButtonClick: () => {
        confirmDeleteVideo(videoId, () => onDeleteVideo?.())
        closeDeleteVideoDialog()
      },
      onSecondaryButtonClick: () => {
        closeDeleteVideoDialog()
      },
      error: true,
      variant: 'warning',
      primaryButtonText: 'Delete video',
      secondaryButtonText: 'Cancel',
    })
  }

  const confirmDeleteVideo = async (videoId: string, onTxSync?: () => void) => {
    if (!joystream) {
      return
    }

    handleTransaction({
      txFactory: (updateStatus) => joystream.deleteVideo(videoId, activeMemberId, updateStatus),
      onTxSync: async () => {
        await refetchVideosCount()
        removeVideoFromCache(videoId, client)
        onTxSync?.()
      },
      successMessage: {
        title: 'Video successfully deleted!',
        description: 'Your video was marked as deleted and it will no longer show up on Joystream.',
      },
    })
  }

  return deleteVideo
}
