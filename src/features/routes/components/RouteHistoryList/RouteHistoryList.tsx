import React, { useState } from 'react';
import { History } from 'lucide-react';
import { useRouteHistory } from '../../hooks/useRouteHistory';
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
} from './RouteHistoryList.styles';

interface RouteHistoryListProps {
    scheduleId: string;
}

export const RouteHistoryList: React.FC<RouteHistoryListProps> = ({ scheduleId }) => {
    const [page, setPage] = useState(0);
    const { data, isLoading, error } = useRouteHistory({
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
                    Nie udało się załadować historii tras. Spróbuj ponownie później.
                </ErrorText>
            </ErrorContainer>
        );
    }

    if (!data || data.content.length === 0) {
        return (
            <EmptyState>
                <EmptyIcon>
                    <History size={32} />
                </EmptyIcon>
                <EmptyTitle>Brak historii tras</EmptyTitle>
                <EmptyText>
                    Nie znaleziono żadnych zakończonych tras dla tego harmonogramu
                </EmptyText>
            </EmptyState>
        );
    }

    return (
        <>
            <ListContainer>
                {data.content.sort((a, b) =>
                    a.date.localeCompare(b.date)
                ).map((route) => (
                    <RouteCard key={route.id} route={route} type="history" />
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