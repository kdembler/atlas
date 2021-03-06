import React from 'react'

import { Container, Name, StyledAvatar } from './ChannelAvatar.style'

type ChannelAvatarProps = {
  title: string
  avatarUrl?: string | null
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const ChannelAvatar: React.FC<ChannelAvatarProps> = ({ title, avatarUrl, className, onClick }) => {
  return (
    <Container className={className} onClick={onClick}>
      <StyledAvatar assetUrl={avatarUrl} />
      <Name>{title}</Name>
    </Container>
  )
}
