// src/features/dashboard/components/AlertsSection/AlertsSection.tsx

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAlerts } from '../../hooks/useAlerts';
import { AlertFilters, AlertType } from '../../types';
import { AlertsFilter } from './AlertsFilter';
import { AlertCard } from './AlertCard';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import {
    AlertsContainer,
    AlertsHeader,
    AlertsTitle,
    AlertsGrid,
} from './AlertsSection.styles';

export const AlertsSection: React.FC = () => {
    const [filters, setFilters] = useState<AlertFilters>({ scope: '7_DAYS' });
    const { data, isLoading, error } = useAlerts(filters);

    const handleActionClick = (type: AlertType) => {
        // TODO: Navigate to specific alerts page
        console.log('Navigate to alerts page for type:', type);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error || !data) {
        return <p>Nie udało się załadować alertów.</p>;
    }

    const alertTypes: AlertType[] = [
        'CHILDREN_NO_ROUTES',
        'ROUTES_NO_DRIVERS',
        'DRIVER_DOCUMENTS',
    ];

    return (
        <AlertsContainer>
            <AlertsHeader>
                <AlertsTitle>
                    <AlertTriangle size={18} /> WYMAGAJĄ NATYCHMIASTOWEJ UWAGI
                </AlertsTitle>
                <AlertsFilter filters={filters} onChange={setFilters} />
            </AlertsHeader>

            <AlertsGrid>
                {alertTypes.map((type) => {
                    const alert = data.alerts.find((a) => a.type === type);
                    return (
                        <AlertCard
                            key={type}
                            type={type}
                            count={alert?.count || 0}
                            onActionClick={() => handleActionClick(type)}
                        />
                    );
                })}
            </AlertsGrid>
        </AlertsContainer>
    );
};