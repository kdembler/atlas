import React from 'react'
import { BreakPoint } from 'react-glider'

import styled from '@emotion/styled'

import { Gallery, MAX_VIDEO_PREVIEW_WIDTH, VideoPreviewBase, breakpointsOfGrid } from '@/shared/components'
import VideoPreview from './VideoPreviewWithNavigation'
import { VideoFields } from '@/api/queries/__generated__/VideoFields'

import { spacing } from '@/shared/theme'

type VideoGalleryProps = {
  title?: string
  action?: string
  videos?: VideoFields[]
  loading?: boolean
}

const PLACEHOLDERS_COUNT = 12

const trackPadding = `${spacing.xs} 0 0 0`

// This is needed since Gliderjs and the Grid have different resizing policies
const breakpoints = breakpointsOfGrid({
  breakpoints: 6,
  minItemWidth: 300,
  gridColumnGap: 24,
  viewportContainerDifference: 64,
}).map((breakpoint, idx) => ({
  breakpoint,
  settings: {
    slidesToShow: idx + 1,
  },
})) as BreakPoint[]

const VideoGallery: React.FC<VideoGalleryProps> = ({ title, action, videos, loading }) => {
  const displayPlaceholders = loading || !videos

  return (
    <Gallery title={title} action={action} trackPadding={trackPadding} responsive={breakpoints}>
      {displayPlaceholders
        ? Array.from({ length: PLACEHOLDERS_COUNT }).map((_, idx) => (
            <StyledVideoPreviewBase key={`video-placeholder-${idx}`} />
          ))
        : videos!.map((video) => (
            <StyledVideoPreview
              id={video.id}
              channelId={video.channel.id}
              title={video.title}
              channelName={video.channel.handle}
              channelAvatarURL={video.channel.avatarPhotoURL}
              views={video.views}
              createdAt={video.publishedOnJoystreamAt}
              duration={video.duration}
              posterURL={video.thumbnailURL}
              key={video.id}
            />
          ))}
    </Gallery>
  )
}

const StyledVideoPreviewBase = styled(VideoPreviewBase)`
  & + & {
    margin-left: 1.25rem;
  }

  width: ${MAX_VIDEO_PREVIEW_WIDTH};
`
const StyledVideoPreview = styled(VideoPreview)`
  & + & {
    margin-left: 24px;
  }

  width: ${MAX_VIDEO_PREVIEW_WIDTH};
`

export default VideoGallery
