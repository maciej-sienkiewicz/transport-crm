import React from 'react';
import { StyledButton } from './Button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'primary',
                                                  size = 'md',
                                                  fullWidth = false,
                                                  isLoading = false,
                                                  children,
                                                  disabled,
                                                  ...props
                                              }) => {
    return (
        <StyledButton
            $variant={variant}
            $size={size}
            $fullWidth={fullWidth}
            $isLoading={isLoading}
            disabled={disabled || isLoading}
            {...props}
        >
            {!isLoading && children}
        </StyledButton>
    );
};