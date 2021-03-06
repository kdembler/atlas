import React from 'react'

import { ButtonIconWrapper, StyledButtonBase, StyledText, TextColorVariant } from './Button.style'

import { ButtonBaseProps, ButtonSize } from '../ButtonBase'
import { TextVariant } from '../Text'

export type ButtonProps = {
  icon?: React.ReactNode
  textColorVariant?: TextColorVariant
  children: string
} & Omit<ButtonBaseProps, 'children'>

const BUTTON_SIZE_TO_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  large: 'button1',
  medium: 'button2',
  small: 'button3',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ icon, children, size = 'medium', textColorVariant = 'default', ...baseButtonProps }, ref) => {
    return (
      <StyledButtonBase ref={ref} size={size} {...baseButtonProps}>
        {icon && <ButtonIconWrapper>{icon}</ButtonIconWrapper>}
        {children && (
          <StyledText variant={BUTTON_SIZE_TO_TEXT_VARIANT[size]} textColorVariant={textColorVariant} size={size}>
            {children}
          </StyledText>
        )}
      </StyledButtonBase>
    )
  }
)
Button.displayName = 'Button'
