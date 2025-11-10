import React, { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { useUpcomingRoutes } from '../../hooks/useUpcomingRoutes';
import { RouteCard } from '../RouteCard';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Pagination } from '@/shared/ui/Pagination';
import {
    ListContainer,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptyText,
    ErrorContainer,
    ErrorText,
} from './UpcomingRoutesList.styles';

interface UpcomingRoutesListProps {
    scheduleId: string;
}

export const UpcomingRoutesList: React.FC<UpcomingRoutesListProps> = ({ scheduleId }) => {
    const [page, setPage] = useState(0);
    const { data, isLoading, error } = useUpcomingRoutes({
        scheduleId,
        page,
        size: 5,
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <ErrorContainer>
                <ErrorText>
                    Nie udało się załadować nadchodzących tras. Spróbuj ponownie później.
                </ErrorText>
            </ErrorContainer>
        );
    }

    if (!data || data.content.length === 0) {
        return (
            <EmptyState>
                <EmptyIcon>
                    <CalendarClock size={32} />
                </EmptyIcon>
                <EmptyTitle>Brak nadchodzących tras</EmptyTitle>
                <EmptyText>
                    Nie znaleziono żadnych zaplanowanych tras dla tego harmonogramu
                </EmptyText>
            </EmptyState>
        );
    }

    return (
        <>
            <ListContainer>
                {data.content.map((route) => (
                    <RouteCard key={route.id} route={route} type="upcoming" />
                ))}
            </ListContainer>

            <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
            />
        </>
    );
};