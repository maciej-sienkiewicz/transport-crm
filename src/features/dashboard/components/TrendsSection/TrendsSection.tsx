import React from 'react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useTrends } from '../../hooks/useTrends';
import { KPICard } from './KPICard';
import {
    SectionContainer,
    KPIGrid,
    ViewAllContainer
} from './TrendsSection.styles';

export const TrendsSection: React.FC = () => {
    const { data, isLoading, error } = useTrends();

    const handleViewAnalytics = () => {
        console.log('Navigate to analytics');
    };

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
                <p>Nie udało się załadować trendów.</p>
            </SectionContainer>
        );
    }

    const { current, changes } = data;

    return (
        <SectionContainer>
            <KPIGrid>
                <KPICard
                    icon="👥"
                    label="Dzieci"
                    value={current.children}
                    change={changes.children}
                />
                <KPICard
                    icon="🚗"
                    label="Trasy"
                    value={current.routes}
                    change={changes.routes}
                />
                <KPICard
                    icon="❌"
                    label="Anulowania"
                    value={current.cancellations}
                    change={changes.cancellations}
                />
            </KPIGrid>

            <ViewAllContainer>
                <Button variant="secondary" size="sm" onClick={handleViewAnalytics}>
                    📊 Zobacz pełną analitykę →
                </Button>
            </ViewAllContainer>
        </SectionContainer>
    );
};