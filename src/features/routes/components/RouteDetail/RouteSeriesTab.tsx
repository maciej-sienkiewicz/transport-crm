// src/features/routes/components/RouteDetail/RouteSeriesTab.tsx

import React from 'react';
import styled from 'styled-components';
import { Repeat, MapPin, Info, Calendar, Users, User, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useRouteSeriesDetail } from '../../hooks/useRouteSeriesDetail';
import { useRoutes } from '../../hooks/useRoutes';
import { RouteDetail, RouteSeriesStatus } from '../../types';

const SeriesTabContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

const SeriesInfoCard = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    border: 2px solid ${({ theme }) => theme.colors.primary[200]};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
`;

const SeriesHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SeriesTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const SeriesName = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary[900]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SeriesMeta = styled.div`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SeriesDates = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SeriesStats = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatItem = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoBanner = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};

    svg {
        flex-shrink: 0;
        color: ${({ theme }) => theme.colors.primary[600]};
    }

    ul {
        margin: ${({ theme }) => theme.spacing.xs} 0 0 ${({ theme }) => theme.spacing.lg};
        list-style: disc;
    }

    li {
        margin-bottom: ${({ theme }) => theme.spacing.xs};
    }
`;

const UpcomingRoutesCard = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
`;

const CardTitle = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const RouteListItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};

    &:last-child {
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const EmptySeriesCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 2px dashed ${({ theme }) => theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    text-align: center;

    svg {
        color: ${({ theme }) => theme.colors.slate[400]};
        margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
`;

const EmptyTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyDescription = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    max-width: 500px;
    line-height: 1.6;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HelperText = styled.p`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[500]};
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

interface RouteSeriesTabProps {
    route: RouteDetail;
    onCreateSeries: () => void;
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

const getDayShort = (dateString: string): string => {
    const days = ['ndz', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'];
    return days[new Date(dateString).getDay()];
};

const getStatusVariant = (
    status: RouteSeriesStatus
): 'default' | 'primary' | 'success' | 'warning' | 'danger' => {
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

const isPastRoute = (route: RouteDetail): boolean => {
    return ['COMPLETED', 'CANCELLED'].includes(route.status);
};

export const RouteSeriesTab: React.FC<RouteSeriesTabProps> = ({ route, onCreateSeries }) => {
    const { data: series, isLoading } = useRouteSeriesDetail(route.seriesId);

    const shouldShowUpcoming = route.seriesId && ['PLANNED', 'IN_PROGRESS'].includes(route.status);

    const { data: upcomingRoutes } = useRoutes(
        {
            page: 0,
            size: 3,
            sort: 'date,asc',
        },
            { enabled: shouldShowUpcoming }
    );

    const navigateToSeries = (seriesId: string) => {
        window.location.href = `/routes/series/${seriesId}`;
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Stan 1: Trasa należy do serii
    if (route.seriesId && series) {
        return (
            <SeriesTabContainer>
                <SeriesInfoCard>
                    <SeriesHeader>
                        <Repeat size={24} color="#2563eb" />
                        <SeriesTitle>
                            {isPastRoute(route)
                                ? 'Ta trasa była częścią serii'
                                : 'Ta trasa jest częścią serii'}
                        </SeriesTitle>
                    </SeriesHeader>

                    <SeriesName>{series.seriesName}</SeriesName>

                    <SeriesMeta>
                        <Repeat size={16} style={{ display: 'inline', marginRight: '4px' }} />
                        {getRecurrenceLabel(series.recurrenceInterval)} • {getDayLabel(series.dayOfWeek)}
                    </SeriesMeta>

                    <SeriesDates>
                        <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
                        Od: {formatDate(series.startDate)}
                        {series.endDate ? ` do ${formatDate(series.endDate)}` : ' • Bezterminowo'}
                    </SeriesDates>

                    <SeriesStats>
                        <StatItem>
                            <strong>Status:</strong>{' '}
                            <Badge variant={getStatusVariant(series.status)}>{series.status}</Badge>
                        </StatItem>
                        <StatItem>
                            <Users size={16} />
                            Dzieci w serii: {series.schedules?.length || 0}
                        </StatItem>
                        <StatItem>
                            <User size={16} />
                            Kierowca: {route.driver ? `${route.driver.firstName} ${route.driver.lastName}` : 'Nie przypisano'} {/* ← ZMIANA */}
                        </StatItem>
                        <StatItem>
                            <Truck size={16} />
                            Pojazd: {route.vehicle.registrationNumber}
                        </StatItem>
                    </SeriesStats>

                    <Button variant="primary" onClick={() => navigateToSeries(series.id)}>
                        Zobacz szczegóły serii
                        <ArrowRight size={16} />
                    </Button>
                </SeriesInfoCard>

                <InfoBanner>
                    <Info size={20} />
                    <div>
                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Informacje o serii
                        </strong>
                        <ul>
                            <li>Zmiany w serii wpłyną na wszystkie przyszłe trasy</li>
                            <li>
                                Aby zmienić pojedynczą trasę, edytuj ją bezpośrednio (nie wpłynie na
                                serię)
                            </li>
                            <li>Seria generuje trasy automatycznie każdego dnia o 2:00</li>
                        </ul>
                    </div>
                </InfoBanner>

                {shouldShowUpcoming && upcomingRoutes && upcomingRoutes.content.length > 0 && (
                    <UpcomingRoutesCard>
                        <CardTitle>Kolejne trasy z tej serii</CardTitle>
                        {upcomingRoutes.content.slice(0, 3).map((upcomingRoute) => (
                            <RouteListItem key={upcomingRoute.id}>
                                <span>
                                    📅 {formatDate(upcomingRoute.date)} ({getDayShort(upcomingRoute.date)})
                                </span>
                                <Badge variant={getStatusVariant(upcomingRoute.status as any)}>
                                    {upcomingRoute.status}
                                </Badge>
                            </RouteListItem>
                        ))}
                        <Button variant="ghost" onClick={() => navigateToSeries(series.id)}>
                            Zobacz wszystkie trasy
                            <ArrowRight size={16} />
                        </Button>
                    </UpcomingRoutesCard>
                )}
            </SeriesTabContainer>
        );
    }

    // Stan 2: Trasa NIE należy do serii
    return (
        <SeriesTabContainer>
            <EmptySeriesCard>
                <MapPin size={48} />
                <EmptyTitle>Ta trasa nie należy do żadnej serii</EmptyTitle>
                <EmptyDescription>
                    To pojedyncza, niecykliczna trasa. Możesz utworzyć serię z tej trasy, aby
                    automatycznie generować podobne trasy w przyszłości.
                </EmptyDescription>
                <Button
                    variant="primary"
                    onClick={onCreateSeries}
                    disabled={route.status !== 'PLANNED'}
                >
                    <Repeat size={18} />
                    Utwórz cykliczną serię
                </Button>
                {route.status !== 'PLANNED' && (
                    <HelperText>Serię można utworzyć tylko z trasy w statusie PLANNED</HelperText>
                )}
            </EmptySeriesCard>
        </SeriesTabContainer>
    );
};