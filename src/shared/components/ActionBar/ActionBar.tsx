import React, { ReactNode } from 'react'
import {
  StyledActionBarContainer,
  StyledInnerContainer,
  StyledInfoContainer,
  StyledPrimaryText,
  StyledSecondaryText,
  StyledTooltip,
  StyledDetailsTextContainer,
  StyledButtonsContainer,
} from './ActionBar.style'
import { Button } from '@/shared/components'
import { SvgAlertInfo } from '@/shared/icons'

export type ActionBarProps = {
  primaryText?: string
  secondaryText?: string
  primaryButtonText?: string
  detailsText?: string
  tooltipText?: string
  detailsTextIcon?: ReactNode
  isActive?: boolean
  secondaryButtonText?: string
  secondaryButtonIcon?: ReactNode
  className?: string
  onConfirmClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ActionBar: React.FC<ActionBarProps> = ({
  primaryText,
  secondaryText,
  primaryButtonText,
  secondaryButtonText,
  detailsText,
  tooltipText,
  detailsTextIcon,
  isActive = true,
  secondaryButtonIcon,
  className,
  onConfirmClick,
  onCancelClick,
}) => {
  return (
    <StyledActionBarContainer className={className} isActive={isActive}>
      <StyledInnerContainer>
        <StyledInfoContainer>
          <StyledPrimaryText>{primaryText}</StyledPrimaryText>
          <StyledSecondaryText>{secondaryText}</StyledSecondaryText>
        </StyledInfoContainer>
        <StyledButtonsContainer>
          {detailsText && tooltipText && (
            <StyledTooltip text={tooltipText} above right>
              <StyledDetailsTextContainer>
                {detailsText} {detailsTextIcon || <SvgAlertInfo />}
              </StyledDetailsTextContainer>
            </StyledTooltip>
          )}
          {secondaryButtonText && !detailsText && (
            <Button icon={secondaryButtonIcon} onClick={onCancelClick} variant="secondary" size="large">
              {secondaryButtonText}
            </Button>
          )}
          {primaryButtonText && (
            <Button onClick={onConfirmClick} size="large" type="submit">
              {primaryButtonText}
            </Button>
          )}
        </StyledButtonsContainer>
      </StyledInnerContainer>
    </StyledActionBarContainer>
  )
}

export default ActionBar
