// src/features/dashboard/components/StatusSection/StatusSection.tsx

import React from 'react';
import { Button } from '@/shared/ui/Button';
import { READINESS_STATUS_CONFIG } from '../../lib/constants';
import { formatDate } from '../../lib/utils';
import { ReadinessInfo } from '../../types';
import {
    SectionContainer,
    StatusBanner,
    StatusEmoji,
    StatusLabel,
    StatusDate,
    StatusMeta,
    MetaItem,
    MetaSeparator,
    ActionButton,
    ContextInfo,
} from './StatusSection.styles';

interface StatusSectionProps {
    readiness: ReadinessInfo;
    date: string;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ readiness, date }) => {
    const config = READINESS_STATUS_CONFIG[readiness.status];

    const handleViewReport = () => {
        // TODO: Navigate to detailed readiness report page
        console.log('Navigate to detailed readiness report for date:', date);

        // Przykładowa nawigacja (gdy będzie taka strona):
        // window.history.pushState({}, '', `/reports/readiness?date=${date}`);
        // window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const isToday = () => {
        const today = new Date();
        const checkDate = new Date(date);
        return (
            today.getFullYear() === checkDate.getFullYear() &&
            today.getMonth() === checkDate.getMonth() &&
            today.getDate() === checkDate.getDate()
        );
    };

    const isTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const checkDate = new Date(date);
        return (
            tomorrow.getFullYear() === checkDate.getFullYear() &&
            tomorrow.getMonth() === checkDate.getMonth() &&
            tomorrow.getDate() === checkDate.getDate()
        );
    };

    const getDateLabel = () => {
        if (isToday()) {
            return 'Dzisiaj';
        }
        if (isTomorrow()) {
            return 'Jutro';
        }
        return formatDate(date);
    };

    const getContextMessage = () => {
        switch (readiness.status) {
            case 'READY':
                return 'System jest w pełni gotowy na operacje transportowe';
            case 'WARNING':
                return 'Niektóre elementy wymagają uwagi, ale system może działać';
            case 'CRITICAL':
                return 'Krytyczne problemy uniemożliwiają normalne funkcjonowanie systemu';
        }
    };

    return (
        <SectionContainer>
            <StatusBanner $status={readiness.status}>
                <StatusEmoji>{config.emoji}</StatusEmoji>

                <StatusLabel $status={readiness.status}>
                    {config.label}
                </StatusLabel>

                <StatusDate>{getDateLabel()}</StatusDate>

                <StatusMeta>
                    <MetaItem>
                        <strong>{readiness.routesCount}</strong>
                        {readiness.routesCount === 1 ? 'trasa' : 'tras'}
                    </MetaItem>
                    <MetaSeparator>•</MetaSeparator>
                    <MetaItem>
                        <strong>{readiness.childrenCount}</strong>
                        {readiness.childrenCount === 1 ? 'dziecko' : 'dzieci'}
                    </MetaItem>
                    <MetaSeparator>•</MetaSeparator>
                    <MetaItem>
                        <strong>{readiness.driversCount}</strong>
                        {readiness.driversCount === 1 ? 'kierowca' : 'kierowców'}
                    </MetaItem>
                </StatusMeta>

                <ContextInfo>{getContextMessage()}</ContextInfo>

                <ActionButton>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleViewReport}
                    >
                        📋 Zobacz szczegółowy raport gotowości
                    </Button>
                </ActionButton>
            </StatusBanner>
        </SectionContainer>
    );
};