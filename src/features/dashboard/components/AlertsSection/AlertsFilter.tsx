// src/features/dashboard/components/AlertsSection/AlertsFilter.tsx

import React from 'react';
import styled from 'styled-components';
import { AlertFilters } from '../../types';
import { ALERT_SCOPE_LABELS } from '../../lib/constants';

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.slate[300]};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary[600] : 'white'
};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.slate[700]
};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? theme.colors.primary[700] : theme.colors.slate[50]
};
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`;

interface AlertsFilterProps {
    filters: AlertFilters;
    onChange: (filters: AlertFilters) => void;
}

export const AlertsFilter: React.FC<AlertsFilterProps> = ({ filters, onChange }) => {
    const scopes: Array<AlertFilters['scope']> = ['TOMORROW', '3_DAYS', '7_DAYS', '30_DAYS'];

    return (
        <FilterContainer>
            {scopes.map((scope) => (
                <FilterButton
                    key={scope}
                    $active={filters.scope === scope}
                    onClick={() => onChange({ scope })}
                >
                    {ALERT_SCOPE_LABELS[scope]}
                </FilterButton>
            ))}
        </FilterContainer>
    );
};