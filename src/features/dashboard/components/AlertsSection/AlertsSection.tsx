import React, { useState } from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import { AlertScope, AlertType } from '../../types';
import { AlertFilters } from './AlertFilters';
import { AlertCard } from './AlertCard';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import {
    SectionContainer,
    SectionHeader,
    AlertsGrid
} from './AlertsSection.styles';

export const AlertsSection: React.FC = () => {
    const [scope, setScope] = useState<AlertScope>('SEVEN_DAYS');
    const { data, isLoading, error } = useAlerts({ scope });

    if (isLoading) {
        return (
            <SectionContainer>
                <LoadingSpinner />
            </SectionContainer>
        );
    }

    if (error || !data) {
        return (
            <SectionContainer>
                <p>Nie udało się załadować alertów.</p>
            </SectionContainer>
        );
    }

    const alertTypes: AlertType[] = [
        'CHILDREN_NO_ROUTES',
        'ROUTES_NO_DRIVERS',
        'DRIVER_DOCUMENTS'
    ];

    const getAlertCount = (type: AlertType): number => {
        if (!data.otherAlerts) return 0;
        const alert = data.otherAlerts.find((a) => a.type === type);
        return alert?.count || 0;
    };

    return (
        <SectionContainer>
            <SectionHeader>
                <AlertFilters activeScope={scope} onScopeChange={setScope} />
            </SectionHeader>

            <AlertsGrid>
                {alertTypes.map((type) => (
                    <AlertCard key={type} type={type} count={getAlertCount(type)} />
                ))}
            </AlertsGrid>
        </SectionContainer>
    );
};