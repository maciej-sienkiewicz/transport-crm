// src/features/dashboard/components/ReadinessSection/ReadinessSection.tsx

import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import { ReadinessChecklist } from './ReadinessChecklist';
import { ReadinessStatus } from './ReadinessStatus';
import {
    SectionContainer,
    SectionHeader,
    HeaderTop,
    SectionTitle,
    DateInfo,
    ContextLine,
    SectionContent,
} from './ReadinessSection.styles';

interface ReadinessSectionProps {
    date: string;
}

export const ReadinessSection: React.FC<ReadinessSectionProps> = ({ date }) => {
    const { data, isLoading, error } = useDashboardSummary(date);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('pl-PL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
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
                <SectionContent>
                    <p>Nie udało się załadować danych gotowości operacyjnej.</p>
                </SectionContent>
            </SectionContainer>
        );
    }

    const { readiness } = data;

    return (
        <SectionContainer>
            <SectionHeader>
                <HeaderTop>
                    <SectionTitle>
                        <Calendar size={20} />
                        GOTOWOŚĆ OPERACYJNA - {formatDate(date).toUpperCase()}
                    </SectionTitle>
                    <DateInfo>{formatDate(date)}</DateInfo>
                </HeaderTop>
                <ContextLine>
                    Zaplanowano: {readiness.routesCount} tras, {readiness.childrenCount} dzieci,{' '}
                    {readiness.driversCount} kierowców
                </ContextLine>
            </SectionHeader>

            <SectionContent>
                <ReadinessChecklist checks={readiness.checks} />
                <ReadinessStatus status={readiness.status} />
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Button variant="secondary" size="sm">
                        📋 Zobacz szczegółowy raport gotowości
                    </Button>
                </div>
            </SectionContent>
        </SectionContainer>
    );
};