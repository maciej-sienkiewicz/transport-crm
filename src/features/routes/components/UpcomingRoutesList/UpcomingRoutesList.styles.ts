import styled from 'styled-components';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

export const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  background: linear-gradient(to bottom right, ${({ theme }) => theme.colors.primary[100]}, ${({ theme }) => theme.colors.primary[200]});
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

export const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

export const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.danger[50]};
  border: 1px solid ${({ theme }) => theme.colors.danger[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
`;

export const ErrorText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.danger[700]};
  font-weight: 500;
`;