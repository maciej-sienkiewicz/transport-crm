import styled from 'styled-components';

export const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const AlertsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

export const FiltersContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    flex-wrap: wrap;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: ${({ theme }) => theme.spacing.xs};

        &::-webkit-scrollbar {
            height: 4px;
        }
    }
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.slate[300]};
  background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : 'white'};
  color: ${({ $active }) => ($active ? 'white' : '#64748b')};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : theme.colors.slate[50]};
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: 0.8125rem;
  }
`;