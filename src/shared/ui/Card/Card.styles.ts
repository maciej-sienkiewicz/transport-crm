import styled, { css } from 'styled-components';

interface StyledCardProps {
    $variant?: 'default' | 'glass' | 'gradient';
    $hoverable?: boolean;
}

export const StyledCard = styled.div<StyledCardProps>`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid rgba(226, 232, 240, 0.6);
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ $variant, theme }) => {
    switch ($variant) {
        case 'glass':
            return css`
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(226, 232, 240, 0.6);
        `;
        case 'gradient':
            return css`
          background: ${theme.gradients.cardHeader};
          border: 1px solid ${theme.colors.slate[200]};
        `;
        default:
            return css`
          background: white;
        `;
    }
}}

  ${({ $hoverable }) =>
    $hoverable &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
        border-color: ${({ theme }) => theme.colors.primary[200]};
      }
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-radius: ${({ theme }) => theme.borderRadius.xl};
  }
`;

export const CardHeader = styled.div<{ $gradient?: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);

  ${({ $gradient, theme }) =>
    $gradient &&
    css`
      background: ${theme.gradients.cardHeader};
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.9375rem;
  }
`;

export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  background: ${({ theme }) => theme.colors.slate[50]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`;