import React, { useState, useRef } from 'react'
import { Story, Meta } from '@storybook/react'
import ImageCropDialog, { ImageCropDialogImperativeHandle, ImageCropDialogProps } from './ImageCropDialog'
import { ImageCropData } from '@/types/cropper'
import { Avatar, Placeholder } from '@/shared/components'
import { OverlayManagerProvider, UploadingFilesDataProvider, useUploadingFilesData } from '@/hooks'
import { css } from '@emotion/react'
import styled from '@emotion/styled/'

export default {
  title: 'General/ImageCropDialog',
  component: ImageCropDialog,
  argTypes: {
    showDialog: { table: { disable: true } },
    imageType: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <UploadingFilesDataProvider>
          <Story />
        </UploadingFilesDataProvider>
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<ImageCropDialogProps> = () => {
  const { addUploadingFileData } = useUploadingFilesData()
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const thumbnailDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null)
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)

  const handleAvatarConfirm = (blob: Blob, url: string, imageCropData: ImageCropData) => {
    addUploadingFileData({
      hash: `${blob.size}${blob.type}`,
      storageProvider: 'storage',
      type: 'avatar',
      imageCropData,
      size: blob.size,
      parentObject: {
        type: 'channel',
        id: `${blob.size}${blob.size}${blob.size}${blob.size}`,
      },
      status: 'inProgress',
    })
    setAvatarImageUrl(url)
  }

  const handleThumbnailConfirm = (blob: Blob, url: string, imageCropData: ImageCropData) => {
    setThumbnailImageUrl(url)
  }

  const handleCoverConfirm = (blob: Blob, url: string, imageCropData: ImageCropData) => {
    setCoverImageUrl(url)
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: start;
        > * {
          margin-bottom: 24px !important;
        }
      `}
    >
      <Avatar imageUrl={avatarImageUrl} editable onEditClick={() => avatarDialogRef.current?.open()} size="cover" />

      {thumbnailImageUrl ? (
        <Image src={thumbnailImageUrl} onClick={() => thumbnailDialogRef.current?.open()} />
      ) : (
        <ImagePlaceholder onClick={() => thumbnailDialogRef.current?.open()} />
      )}
      {coverImageUrl ? (
        <Image src={coverImageUrl} onClick={() => coverDialogRef.current?.open()} />
      ) : (
        <ImagePlaceholder onClick={() => coverDialogRef.current?.open()} />
      )}

      <ImageCropDialog imageType="avatar" onConfirm={handleAvatarConfirm} ref={avatarDialogRef} />
      <ImageCropDialog imageType="videoThumbnail" onConfirm={handleThumbnailConfirm} ref={thumbnailDialogRef} />
      <ImageCropDialog imageType="cover" onConfirm={handleCoverConfirm} ref={coverDialogRef} />
    </div>
  )
}
export const Regular = RegularTemplate.bind({})

const ImagePlaceholder = styled(Placeholder)`
  width: 600px;
  min-height: 200px;
  cursor: pointer;
`

const Image = styled.img`
  width: 600px;
  cursor: pointer;
`