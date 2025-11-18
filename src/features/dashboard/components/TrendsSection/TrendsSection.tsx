// src/features/dashboard/components/TrendsSection/TrendsSection.tsx

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useTrends } from '../../hooks/useTrends';
import { TrendItem } from './TrendItem';
import {
    TrendsContainer,
    TrendsHeader,
    TrendsTitle,
    TrendsList,
} from './TrendsSection.styles';

export const TrendsSection: React.FC = () => {
    const { data, isLoading, error } = useTrends();

    if (isLoading) {
        return (
            <TrendsContainer>
                <LoadingSpinner />
            </TrendsContainer>
        );
    }

    if (error || !data) {
        return (
            <TrendsContainer>
                <p>Nie udało się załadować trendów.</p>
            </TrendsContainer>
        );
    }

    const { current, previous, changes } = data;

    return (
        <TrendsContainer>
            <TrendsHeader>
                <TrendsTitle>
                    <TrendingUp size={18} /> TRENDY - TEN TYDZIEŃ VS POPRZEDNI
                </TrendsTitle>
            </TrendsHeader>

            <TrendsList>
                <TrendItem
                    icon="children"
                    label="Dzieci"
                    previousValue={previous.children}
                    currentValue={current.children}
                    change={changes.children}
                />
                <TrendItem
                    icon="routes"
                    label="Trasy"
                    previousValue={previous.routes}
                    currentValue={current.routes}
                    change={changes.routes}
                />
                <TrendItem
                    icon="cancellations"
                    label="Anulowania"
                    previousValue={previous.cancellations}
                    currentValue={current.cancellations}
                    change={changes.cancellations}
                    showInfo
                    infoText="Porównanie z średnią historyczną (ostatnie 12 tygodni)"
                />
            </TrendsList>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Button variant="secondary" size="sm">
                    📊 Zobacz pełną analitykę →
                </Button>
            </div>
        </TrendsContainer>
    );
};