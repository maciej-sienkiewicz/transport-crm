// src/features/routes/components/RouteSeriesDetail/RouteSeriesDetail.tsx

import React, { useState } from 'react';
import { Ban } from 'lucide-react';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import { useRouteSeriesDetail } from '../../hooks/useRouteSeriesDetail';
import { SeriesInfoSection } from './SeriesInfoSection';
import { SeriesChildrenSection } from './SeriesChildrenSection';
import { CancelSeriesDialog } from '../CancelSeriesDialog';
import {
    DetailContainer,
    HeaderCard,
    HeaderTop,
    HeaderRow,
    SeriesTitle,
    SeriesMeta,
    MetaItem,
    HeaderActions,
    StatsGrid,
    StatCard,
    StatLabel,
    StatValue,
} from './RouteSeriesDetail.styles';
import { Badge } from '@/shared/ui/Badge';
import { Repeat, Calendar } from 'lucide-react';

interface RouteSeriesDetailProps {
    id: string;
}

const getRecurrenceLabel = (interval: number): string => {
    switch (interval) {
        case 1:
            return 'Co tydzień';
        case 2:
            return 'Co 2 tygodnie';
        case 3:
            return 'Co 3 tygodnie';
        case 4:
            return 'Co 4 tygodnie';
        default:
            return `Co ${interval} tygodni`;
    }
};

const getDayLabel = (day: string): string => {
    const days: Record<string, string> = {
        MONDAY: 'Poniedziałki',
        TUESDAY: 'Wtorki',
        WEDNESDAY: 'Środy',
        THURSDAY: 'Czwartki',
        FRIDAY: 'Piątki',
        SATURDAY: 'Soboty',
        SUNDAY: 'Niedziele',
    };
    return days[day] || day;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'primary';
        case 'PAUSED':
            return 'warning';
        case 'CANCELLED':
            return 'danger';
        case 'COMPLETED':
            return 'default';
        default:
            return 'default';
    }
};

const statusLabels: Record<string, string> = {
    ACTIVE: 'Aktywna',
    PAUSED: 'Wstrzymana',
    CANCELLED: 'Anulowana',
    COMPLETED: 'Zakończona',
};

export const RouteSeriesDetail: React.FC<RouteSeriesDetailProps> = ({ id }) => {
    const { data: series, isLoading } = useRouteSeriesDetail(id);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    if (isLoading || !series) {
        return <LoadingSpinner />;
    }

    const canCancel = series.status === 'ACTIVE';

    return (
        <DetailContainer>
            <HeaderCard>
                <HeaderTop>
                    <HeaderRow>
                        <div>
                            <SeriesTitle>{series.seriesName}</SeriesTitle>
                            <SeriesMeta>
                                <MetaItem>
                                    <Repeat size={16} />
                                    {getRecurrenceLabel(series.recurrenceInterval)}
                                </MetaItem>
                                <MetaItem>
                                    <Calendar size={16} />
                                    {getDayLabel(series.dayOfWeek)}
                                </MetaItem>
                                <Badge variant={getStatusVariant(series.status)}>
                                    {statusLabels[series.status]}
                                </Badge>
                            </SeriesMeta>
                        </div>
                        <HeaderActions>
                            {canCancel && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setIsCancelDialogOpen(true)}
                                >
                                    <Ban size={16} />
                                    Anuluj serię
                                </Button>
                            )}
                        </HeaderActions>
                    </HeaderRow>
                </HeaderTop>

                <StatsGrid>
                    <StatCard>
                        <StatLabel>Dzieci w serii</StatLabel>
                        <StatValue>{series.schedules?.length || 0}</StatValue>
                    </StatCard>
                    <StatCard>
                        <StatLabel>Data rozpoczęcia</StatLabel>
                        <StatValue style={{ fontSize: '1rem' }}>{formatDate(series.startDate)}</StatValue>
                    </StatCard>
                    <StatCard>
                        <StatLabel>Data zakończenia</StatLabel>
                        <StatValue style={{ fontSize: '1rem' }}>
                            {series.endDate ? formatDate(series.endDate) : 'Bezterminowo'}
                        </StatValue>
                    </StatCard>
                    <StatCard>
                        <StatLabel>Utworzona</StatLabel>
                        <StatValue style={{ fontSize: '1rem' }}>
                            {formatDate(series.createdAt)}
                        </StatValue>
                    </StatCard>
                </StatsGrid>
            </HeaderCard>

            <SeriesInfoSection series={series} />

            <SeriesChildrenSection series={series} />

            <CancelSeriesDialog
                isOpen={isCancelDialogOpen}
                onClose={() => setIsCancelDialogOpen(false)}
                series={series}
            />
        </DetailContainer>
    );
};