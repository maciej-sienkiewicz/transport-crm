// src/features/guardians/components/GuardianActivityHistory/GuardianActivityHistory.tsx
import React, { useState } from 'react';
import { User, Clock, FileText } from 'lucide-react';
import styled from 'styled-components';
import { useGuardianActivities } from '../../hooks/useGuardianActivities';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Pagination } from '@/shared/ui/Pagination';
import { ActivityCategory } from '@/shared/types/activity';
import {
    activityCategoryLabels,
    formatActivityTimestamp,
    getActivityColor,
} from '@/features/children/lib/activityUtils';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    flex-wrap: wrap;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const FilterWrapper = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: center;
    flex: 1;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        flex-direction: column;
    }
`;

const FilterSelect = styled.div`
    min-width: 200px;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        min-width: 100%;
    }
`;

const Timeline = styled.div`
    position: relative;
    padding-left: ${({ theme }) => theme.spacing.xl};

    &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(
            to bottom,
            ${({ theme }) => theme.colors.slate[200]},
            ${({ theme }) => theme.colors.slate[100]}
        );
    }
`;

const TimelineItem = styled.div`
    position: relative;
    padding-bottom: ${({ theme }) => theme.spacing.xl};

    &:last-child {
        padding-bottom: 0;
    }
`;

const TimelineDot = styled.div<{ $color: string }>`
    position: absolute;
    left: -30px;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    border: 3px solid white;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.slate[200]};
`;

const EventCard = styled.div`
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
        border-color: ${({ theme }) => theme.colors.primary[200]};
    }
`;

const EventHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

const EventHeaderLeft = styled.div`
    flex: 1;
`;

const EventTitle = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EventMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const EventDescription = styled.div`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    line-height: 1.6;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EventDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const DetailRow = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const DetailLabel = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    min-width: 120px;
`;

const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

const EmptyIcon = styled.div`
    width: 64px;
    height: 64px;
    margin: 0 auto ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

const EmptyTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EmptyText = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

interface GuardianActivityHistoryProps {
    guardianId: string;
}

const categoryOptions = [
    { value: '', label: 'Wszystkie kategorie' },
    { value: 'CHILD', label: activityCategoryLabels.CHILD },
    { value: 'GUARDIAN', label: activityCategoryLabels.GUARDIAN },
    { value: 'ROUTE', label: activityCategoryLabels.ROUTE },
    { value: 'SCHEDULE', label: activityCategoryLabels.SCHEDULE },
];

export const GuardianActivityHistory: React.FC<GuardianActivityHistoryProps> = ({ guardianId }) => {
    const [page, setPage] = useState(0);
    const [category, setCategory] = useState<ActivityCategory | undefined>(undefined);

    const { data, isLoading, error } = useGuardianActivities(guardianId, {
        category,
        page,
        size: 20,
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
                        <FileText size={32} />
                    </EmptyIcon>
                    <EmptyTitle>
                        {category ? 'Brak aktywności w tej kategorii' : 'Brak historii aktywności'}
                    </EmptyTitle>
                    <EmptyText>
                        {category
                            ? 'Nie znaleziono żadnych aktywności w wybranej kategorii'
                            : 'Historia zmian i wydarzeń związanych z tym opiekunem będzie wyświetlana tutaj'}
                    </EmptyText>
                </EmptyState>
            ) : (
                <>
                    <Timeline>
                        {activities.map((activity) => (
                            <TimelineItem key={activity.id}>
                                <TimelineDot $color={getActivityColor(activity.category)} />
                                <EventCard>
                                    <EventHeader>
                                        <EventHeaderLeft>
                                            <EventTitle>{activity.title}</EventTitle>
                                            <EventMeta>
                                                <MetaItem>
                                                    <Clock size={14} />
                                                    {formatActivityTimestamp(activity.timestamp)}
                                                </MetaItem>
                                                <MetaItem>
                                                    <User size={14} />
                                                    {activity.performedBy.name} ({activity.performedBy.role})
                                                </MetaItem>
                                            </EventMeta>
                                        </EventHeaderLeft>
                                        <Badge variant="primary">
                                            {activityCategoryLabels[activity.category]}
                                        </Badge>
                                    </EventHeader>

                                    <EventDescription>{activity.description}</EventDescription>

                                    {activity.details && (
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
                        ))}
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