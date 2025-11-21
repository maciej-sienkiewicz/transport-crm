// src/features/routes/components/RouteSeriesList/RouteSeriesList.tsx

import React, { useState } from 'react';
import { Repeat, Calendar, Users, ChevronRight } from 'lucide-react';
import { Select } from '@/shared/ui/Select';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Pagination } from '@/shared/ui/Pagination';
import { useRouteSeries } from '../../hooks/useRouteSeries';
import { RouteSeriesStatus } from '../../types';
import {
    FiltersContainer,
    SeriesCard,
    SeriesHeader,
    SeriesIcon,
    SeriesInfo,
    SeriesName,
    SeriesMeta,
    MetaItem,
    SeriesFooter,
    EmptyState,
    EmptyIcon,
    EmptyText,
    EmptyHint,
} from './RouteSeriesList.styles';

const statusLabels: Record<RouteSeriesStatus, string> = {
    ACTIVE: 'Aktywna',
    PAUSED: 'Wstrzymana',
    CANCELLED: 'Anulowana',
    COMPLETED: 'Zakończona',
};

const statusVariants: Record<
    RouteSeriesStatus,
    'default' | 'primary' | 'success' | 'warning' | 'danger'
> = {
    ACTIVE: 'primary',
    PAUSED: 'warning',
    CANCELLED: 'danger',
    COMPLETED: 'default',
};

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
        month: '2-digit',
        year: 'numeric',
    });
};

export const RouteSeriesList: React.FC = () => {
    const [page, setPage] = useState(0);
    const [filterStatus, setFilterStatus] = useState<RouteSeriesStatus | ''>('');

    const { data, isLoading } = useRouteSeries({
        page,
        size: 20,
        status: filterStatus || undefined,
    });

    const handleSeriesClick = (id: string) => {
        window.location.href = `/routes/series/${id}`;
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <FiltersContainer>
                <Select
                    label="Status"
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value as RouteSeriesStatus | '');
                        setPage(0);
                    }}
                    options={[
                        { value: '', label: 'Wszystkie' },
                        { value: 'ACTIVE', label: 'Aktywne' },
                        { value: 'PAUSED', label: 'Wstrzymane' },
                        { value: 'CANCELLED', label: 'Anulowane' },
                        { value: 'COMPLETED', label: 'Zakończone' },
                    ]}
                />
            </FiltersContainer>

            {!data?.content.length ? (
                <EmptyState>
                    <EmptyIcon>
                        <Repeat size={40} />
                    </EmptyIcon>
                    <EmptyText>Brak serii tras do wyświetlenia</EmptyText>
                    <EmptyHint>
                        {filterStatus
                            ? 'Spróbuj zmienić filtry'
                            : 'Utwórz pierwszą serię z istniejącej trasy'}
                    </EmptyHint>
                </EmptyState>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {data.content.map((series) => (
                            <SeriesCard key={series.id} onClick={() => handleSeriesClick(series.id)}>
                                <SeriesHeader>
                                    <SeriesIcon>
                                        <Repeat size={24} />
                                    </SeriesIcon>
                                    <SeriesInfo>
                                        <SeriesName>{series.seriesName}</SeriesName>
                                        <SeriesMeta>
                                            <MetaItem>
                                                <Repeat size={14} />
                                                {getRecurrenceLabel(series.recurrenceInterval)}
                                            </MetaItem>
                                            <MetaItem>
                                                <Calendar size={14} />
                                                {getDayLabel(series.dayOfWeek)}
                                            </MetaItem>
                                        </SeriesMeta>
                                    </SeriesInfo>
                                    <Badge variant={statusVariants[series.status]}>
                                        {statusLabels[series.status]}
                                    </Badge>
                                </SeriesHeader>

                                <SeriesFooter>
                                    <MetaItem>
                                        <Users size={16} />
                                        {series.schedulesCount} {series.schedulesCount === 1 ? 'dziecko' : 'dzieci'}
                                    </MetaItem>
                                    <MetaItem style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                                        {formatDate(series.startDate)}
                                        {series.endDate ? ` - ${formatDate(series.endDate)}` : ''}
                                    </MetaItem>
                                    <ChevronRight size={20} color="#94a3b8" />
                                </SeriesFooter>
                            </SeriesCard>
                        ))}
                    </div>

                    {data.totalPages > 1 && (
                        <div style={{ marginTop: '2rem' }}>
                            <Pagination
                                currentPage={page}
                                totalPages={data.totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};