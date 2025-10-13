import React from 'react';
import styled, { css } from 'styled-components';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'default';

interface StyledBadgeProps {
    $variant: BadgeVariant;
}

const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  white-space: nowrap;

  ${({ $variant, theme }) => {
    switch ($variant) {
        case 'primary':
            return css`
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
        case 'success':
            return css`
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
        case 'warning':
            return css`
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
        case 'danger':
            return css`
          background: ${theme.colors.danger[100]};
          color: ${theme.colors.danger[700]};
        `;
        default:
            return css`
          background: ${theme.colors.slate[100]};
          color: ${theme.colors.slate[700]};
        `;
    }
}}
`;

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
    return <StyledBadge $variant={variant}>{children}</StyledBadge>;
};