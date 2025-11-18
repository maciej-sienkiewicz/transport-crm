import React from 'react';
import { AlertScope } from '../../types';
import { ALERT_SCOPE_LABELS } from '../../lib/constants';
import { FiltersContainer, FilterButton } from './AlertsSection.styles';

interface AlertFiltersProps {
    activeScope: AlertScope;
    onScopeChange: (scope: AlertScope) => void;
}

const scopes: AlertScope[] = ['TOMORROW', 'THREE_DAYS', 'SEVEN_DAYS', 'THIRTY_DAYS'];

export const AlertFilters: React.FC<AlertFiltersProps> = ({
                                                              activeScope,
                                                              onScopeChange
                                                          }) => {
    return (
        <FiltersContainer>
            {scopes.map((scope) => (
                <FilterButton
                    key={scope}
                    $active={activeScope === scope}
                    onClick={() => onScopeChange(scope)}
                >
                    {ALERT_SCOPE_LABELS[scope]}
                </FilterButton>
            ))}
        </FiltersContainer>
    );
};