import styled, { css } from 'styled-components';

interface StyledButtonProps {
    $variant: 'primary' | 'secondary' | 'ghost' | 'danger';
    $size: 'sm' | 'md' | 'lg';
    $fullWidth?: boolean;
    $isLoading?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  border: none;
  outline: none;
  position: relative;
  
  ${({ $size, theme }) => {
    switch ($size) {
        case 'sm':
            return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 0.875rem;
        `;
        case 'lg':
            return css`
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: 1rem;
        `;
        default:
            return css`
          padding: 0.625rem ${theme.spacing.lg};
          font-size: 0.9375rem;
        `;
    }
}}

  ${({ $variant, theme }) => {
    switch ($variant) {
        case 'primary':
            return css`
          background: ${theme.gradients.primaryButton};
          color: white;
          box-shadow: ${theme.shadows.primaryGlow};

          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 20px 40px -5px rgba(37, 99, 235, 0.4);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
        case 'secondary':
            return css`
          background: white;
          color: ${theme.colors.slate[700]};
          border: 1px solid ${theme.colors.slate[200]};
          box-shadow: ${theme.shadows.sm};

          &:hover:not(:disabled) {
            background: ${theme.colors.slate[50]};
            border-color: ${theme.colors.slate[300]};
          }
        `;
        case 'ghost':
            return css`
          background: transparent;
          color: ${theme.colors.slate[700]};

          &:hover:not(:disabled) {
            background: ${theme.colors.slate[100]};
          }
        `;
        case 'danger':
            return css`
          background: ${theme.colors.danger[600]};
          color: white;

          &:hover:not(:disabled) {
            background: ${theme.colors.danger[700]};
          }
        `;
    }
}}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      pointer-events: none;
      
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.875rem;
    padding: 0.5rem ${({ theme }) => theme.spacing.md};
  }
`;