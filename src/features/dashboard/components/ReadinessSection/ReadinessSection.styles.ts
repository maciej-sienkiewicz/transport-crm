// src/features/dashboard/components/ReadinessSection/ReadinessSection.styles.ts

import styled from 'styled-components';

export const SectionContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.gradients.cardHeader};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const DateInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  font-weight: 500;
`;

export const ContextLine = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SectionContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;