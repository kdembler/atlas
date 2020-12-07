import React from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import { useQuery } from '@apollo/client'

import { GET_CHANNEL } from '@/api/queries/channels'
import { GetChannel, GetChannelVariables } from '@/api/queries/__generated__/GetChannel'

import {
  AvatarPlaceholder,
  CoverImage,
  Header,
  Media,
  MediaWrapper,
  StyledAvatar,
  StyledBgPattern,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
  VideoSection,
} from './ChannelView.style'
import { InfiniteVideoGrid } from '@/shared/components'

const ChannelView: React.FC<RouteComponentProps> = () => {
  const { id } = useParams()
  const { data, loading, error } = useQuery<GetChannel, GetChannelVariables>(GET_CHANNEL, {
    variables: { id },
  })

  if (error) {
    throw error
  }

  if (!loading && !data?.channel) {
    return <span>Channel not found</span>
  }

  return (
    <>
      <Header>
        <MediaWrapper>
          <Media>
            {data?.channel?.coverPhotoUrl ? <CoverImage src={data.channel.coverPhotoUrl} /> : <StyledBgPattern />}
          </Media>
        </MediaWrapper>
        <TitleSection>
          {data?.channel ? (
            <>
              <StyledAvatar img={data.channel.avatarPhotoUrl} name={data.channel.handle} />
              <TitleContainer>
                <Title variant="h1">{data.channel.handle}</Title>
              </TitleContainer>
            </>
          ) : (
            <>
              <AvatarPlaceholder />
              <TitlePlaceholder />
            </>
          )}
        </TitleSection>
      </Header>
      <VideoSection>
        <InfiniteVideoGrid channelId={id} />
      </VideoSection>
    </>
  )
}
export default ChannelView
