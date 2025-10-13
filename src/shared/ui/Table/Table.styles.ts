import styled from 'styled-components';

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid rgba(226, 232, 240, 0.6);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
`;

export const TableHead = styled.thead`
  background: ${({ theme }) => theme.gradients.cardHeader};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const TableBody = styled.tbody`
  & > tr:last-child td {
    border-bottom: none;
  }
`;

export const TableRow = styled.tr`
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[50]};
  }
`;

export const TableHeader = styled.th`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[700]};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  white-space: nowrap;

  &:first-child {
    padding-left: ${({ theme }) => theme.spacing.xl};
  }

  &:last-child {
    padding-right: ${({ theme }) => theme.spacing.xl};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: 0.8125rem;

    &:first-child {
      padding-left: ${({ theme }) => theme.spacing.lg};
    }

    &:last-child {
      padding-right: ${({ theme }) => theme.spacing.lg};
    }
  }
`;

export const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.slate[700]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[100]};

  &:first-child {
    padding-left: ${({ theme }) => theme.spacing.xl};
  }

  &:last-child {
    padding-right: ${({ theme }) => theme.spacing.xl};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;

    &:first-child {
      padding-left: ${({ theme }) => theme.spacing.lg};
    }

    &:last-child {
      padding-right: ${({ theme }) => theme.spacing.lg};
    }
  }
`;