// src/features/routes/components/RouteDetail/RouteActivityHistory.tsx
import React, { useState } from 'react';
import { User, Clock, FileText, History } from 'lucide-react';
import styled from 'styled-components';
import { useRouteActivities } from '../../hooks/useRouteActivities';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Pagination } from '@/shared/ui/Pagination';
import { ActivityCategory, Activity } from '@/shared/types/activity';

// UWAGA: Poniższe style i utils są REPLIKOWANE z ActivityHistory.tsx,
// z zamianą `theme.spacing` na wartości stałe, aby kod był kompletny.

// --- Symulacja utilów (W produkcyjnym kodzie te funkcje powinny być importowane
// ze wspólnego pliku, np. activityUtils.ts) ---
const activityCategoryLabels: Record<ActivityCategory, string> = {
    CHILD: 'Dziecko',
    GUARDIAN: 'Opiekun',
    ROUTE: 'Trasa',
    SCHEDULE: 'Harmonogram',
    DRIVER: 'Kierowca',
    VEHICLE: 'Pojazd',
    ABSENCE: 'Nieobecność',
};

const formatActivityTimestamp = (timestamp: string) => {
    // Format daty i godziny zgodny z polskimi standardami
    return new Date(timestamp).toLocaleString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getActivityColor = (category: ActivityCategory): string => {
    // Kolory dostosowane do Route, replikowane z ActivityHistory.tsx
    switch (category) {
        case 'ROUTE': return '#2563eb'; // blue-600
        case 'DRIVER': return '#d97706'; // amber-600
        case 'VEHICLE': return '#059669'; // emerald-600
        case 'CHILD': return '#4f46e5'; // indigo-600
        default: return '#6b7280'; // gray-500
    }
};
// --- Koniec Symulacji utilów ---


// --- STYLES (Dokładna replika struktury ActivityHistory.tsx) ---

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* xl */
    padding: 1.5rem;
    min-height: 500px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem; /* md */
    flex-wrap: wrap;
`;

const FilterWrapper = styled.div`
    display: flex;
    gap: 0.75rem; /* md */
    align-items: center;
    flex: 1;
`;

const FilterSelect = styled.div`
    min-width: 200px;
`;

const Timeline = styled.div`
    position: relative;
    padding-left: 1.5rem; /* xl */
    padding-top: 0.5rem;

    &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #e5e7eb; /* gray-200 */
    }
`;

const TimelineItem = styled.div`
    position: relative;
    padding-bottom: 1.5rem; /* xl */
    padding-left: 1.5rem;

    &:last-child {
        padding-bottom: 0;
    }
`;

const TimelineDot = styled.div<{ $color: string }>`
    position: absolute;
    left: 0px;
    top: 6px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    border: 3px solid white;
    box-shadow: 0 0 0 2px #e5e7eb; /* gray-200 */
`;

const EventCard = styled.div`
    background: white;
    border: 1px solid #e5e7eb; /* gray-200 */
    border-radius: 0.5rem; /* rounded-lg */
    padding: 1rem; /* p-4 */
    transition: all 0.15s;

    &:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        border-color: #93c5fd; /* blue-300 */
    }
`;

const EventHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem; /* md */
    margin-bottom: 0.75rem; /* md */
`;

const EventHeaderLeft = styled.div`
    flex: 1;
`;

const EventHeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem; /* sm */
    flex-wrap: wrap;
`;

const EventTitle = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: #111827; /* gray-900 */
    margin-bottom: 0.25rem;
`;

const EventMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem; /* md */
    font-size: 0.875rem;
    color: #6b7280; /* gray-500 */
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem; /* xs */
`;

const EventDescription = styled.div`
    font-size: 0.9375rem;
    color: #374151; /* gray-700 */
    line-height: 1.6;
    margin-bottom: 0.75rem;
`;

const EventDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem; /* xs */
    padding: 0.75rem; /* md */
    background: #f9fafb; /* gray-50 */
    border-radius: 0.5rem; /* lg */
    font-size: 0.875rem;
    color: #4b5563; /* gray-600 */
`;

const DetailRow = styled.div`
    display: flex;
    gap: 0.5rem; /* sm */
`;

const DetailLabel = styled.span`
    font-weight: 600;
    color: #374151; /* gray-700 */
    min-width: 120px;
`;

const EmptyState = styled.div`
    padding: 4rem 2rem;
    text-align: center;
    background: #f9fafb; /* gray-50 */
    border-radius: 0.75rem; /* xl */
    border: 1px dashed #d1d5db; /* gray-300 */
    margin: 1rem 0;
`;

const EmptyIcon = styled.div`
    width: 64px;
    height: 64px;
    margin: 0 auto 0.75rem;
    background: #f3f4f6; /* gray-100 */
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280; /* gray-500 */
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827; /* gray-900 */
  margin-bottom: 0.25rem;
`;

const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: #4b5563; /* gray-600 */
`;

// --- Koniec styli ---


interface RouteActivityHistoryProps {
    routeId: string;
}

// Opcje dla filtra kategorii, dostosowane do Route
const categoryOptions = [
    { value: '', label: 'Wszystkie kategorie' },
    { value: 'ROUTE', label: activityCategoryLabels.ROUTE },
    { value: 'SCHEDULE', label: activityCategoryLabels.SCHEDULE },
    { value: 'DRIVER', label: activityCategoryLabels.DRIVER },
    { value: 'VEHICLE', label: activityCategoryLabels.VEHICLE },
    { value: 'CHILD', label: activityCategoryLabels.CHILD },
];

export const RouteActivityHistory: React.FC<RouteActivityHistoryProps> = ({ routeId }) => {
    const [page, setPage] = useState(0);
    const [category, setCategory] = useState<ActivityCategory | undefined>(undefined);

    const { data, isLoading, error } = useRouteActivities(routeId, {
        category,
        page,
        size: 20, // Rozmiar strony
    });

    const handleCategoryChange = (value: string) => {
        setCategory((value as ActivityCategory) || undefined);
        setPage(0);
    };

    const handleClearFilters = () => {
        setCategory(undefined);
        setPage(0);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <EmptyState>
                <EmptyIcon>
                    <FileText size={32} />
                </EmptyIcon>
                <EmptyTitle>Błąd ładowania</EmptyTitle>
                <EmptyText>Nie udało się załadować historii aktywności. Spróbuj ponownie.</EmptyText>
            </EmptyState>
        );
    }

    const activities = data?.content || [];

    return (
        <Container>
            <Header>
                <FilterWrapper>
                    <FilterSelect>
                        <Select
                            value={category || ''}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            options={categoryOptions}
                            placeholder="Filtruj wg. kategorii"
                        />
                    </FilterSelect>
                    {category && (
                        <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                            Wyczyść filtry
                        </Button>
                    )}
                </FilterWrapper>
            </Header>

            {activities.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>
                        <History size={32} />
                    </EmptyIcon>
                    <EmptyTitle>
                        {category ? 'Brak aktywności w tej kategorii' : 'Brak historii aktywności'}
                    </EmptyTitle>
                    <EmptyText>
                        {category
                            ? 'Nie znaleziono żadnych aktywności w wybranej kategorii.'
                            : 'Historia zmian i wydarzeń związanych z tą trasą (np. zmiana statusu, przypisanie kierowcy) będzie wyświetlana tutaj.'}
                    </EmptyText>
                </EmptyState>
            ) : (
                <>
                    <Timeline>
                        {activities.map((activity) => {
                            const eventColor = getActivityColor(activity.category);

                            return (
                                <TimelineItem key={activity.id}>
                                    <TimelineDot $color={eventColor} />
                                    <EventCard>
                                        <EventHeader>
                                            <EventHeaderLeft>
                                                <EventTitle>{activity.title}</EventTitle>
                                                <EventMeta>
                                                    <MetaItem>
                                                        <Clock size={14} />
                                                        {formatActivityTimestamp(activity.timestamp)}
                                                    </MetaItem>
                                                    {activity.performedBy && (
                                                        <MetaItem>
                                                            <User size={14} />
                                                            {activity.performedBy.name} ({activity.performedBy.role})
                                                        </MetaItem>
                                                    )}
                                                </EventMeta>
                                            </EventHeaderLeft>
                                            <EventHeaderRight>
                                                <Badge variant="primary" style={{ backgroundColor: eventColor, color: 'white' }}>
                                                    {activityCategoryLabels[activity.category]}
                                                </Badge>
                                                {/* Usunięto GoToRouteButton/ArrowRight */}
                                            </EventHeaderRight>
                                        </EventHeader>

                                        <EventDescription>{activity.description}</EventDescription>

                                        {activity.details && Object.keys(activity.details).length > 0 && (
                                            <EventDetails>
                                                {Object.entries(activity.details).map(([key, value]) => (
                                                    <DetailRow key={key}>
                                                        <DetailLabel>{key}:</DetailLabel>
                                                        <span>{value}</span>
                                                    </DetailRow>
                                                ))}
                                            </EventDetails>
                                        )}
                                    </EventCard>
                                </TimelineItem>
                            );
                        })}
                    </Timeline>

                    {data && data.totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={data.totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </Container>
    );
};