import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useRoutes } from '../../hooks/useRoutes';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Table } from '@/shared/ui/Table';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Card } from '@/shared/ui/Card';
import { Calendar, User, Truck, Users, Clock, ChevronRight, MapPin, AlertTriangle } from 'lucide-react';
import { RouteStatus } from '../../types';

const FiltersContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

const EmptyIcon = styled.div`
    width: 80px;
    height: 80px;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.slate[100]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[400]};
`;

const EmptyText = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyHint = styled.p`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

const RouteRow = styled(Table.Row)`
    cursor: pointer;

    &:hover {
        background: ${({ theme }) => theme.colors.slate[50]};
    }
`;

const RouteInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const RouteName = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const RouteDate = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const MetaInfo = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const StopsInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const StopsMain = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[900]};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const StopsSub = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[500]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionCell = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${({ theme }) => theme.colors.slate[400]};
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PaginationButton = styled.button`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.colors.slate[700]};
    font-size: 0.875rem;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.slate[50]};
        border-color: ${({ theme }) => theme.colors.slate[300]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const PageInfo = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const pulseAnimation = keyframes`
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
`;

const PulsingBadge = styled.span<{ variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' }>`
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    animation: ${pulseAnimation} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    ${({ variant, theme }) => {
        switch (variant) {
            case 'primary':
                return css`
                    background-color: ${theme.colors.primary[100]};
                    color: ${theme.colors.primary[700]};
                `;
            case 'success':
                return css`
                    background-color: ${theme.colors.success[100]};
                    color: ${theme.colors.success[700]};
                `;
            case 'warning':
                return css`
                    background-color: ${theme.colors.warning[100]};
                    color: ${theme.colors.warning[700]};
                `;
            case 'danger':
                return css`
                    background-color: ${theme.colors.danger[100]};
                    color: ${theme.colors.danger[700]};
                `;
            default:
                return css`
                    background-color: ${theme.colors.slate[100]};
                    color: ${theme.colors.slate[700]};
                `;
        }
    }}
`;

const StatusBadgeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    align-items: flex-start;
`;

const DelayBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    background-color: ${({ theme }) => theme.colors.danger[100]};
    color: ${({ theme }) => theme.colors.danger[700]};
`;

const statusLabels: Record<RouteStatus, string> = {
    PLANNED: 'Zaplanowana',
    IN_PROGRESS: 'W trakcie',
    COMPLETED: 'Zakończona',
    CANCELLED: 'Anulowana',
    DRIVER_MISSING: 'Brak kierowcy',
};

const statusVariants: Record<RouteStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
    PLANNED: 'primary',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'default',
    DRIVER_MISSING: 'warning',
};

export const RoutesList: React.FC = () => {
    const [page, setPage] = useState(0);
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState<RouteStatus | ''>('');

    const { data, isLoading } = useRoutes({
        page,
        size: 20,
        date: filterDate || undefined,
        status: filterStatus || undefined,
    });

    const handleRouteClick = (id: string) => {
        window.location.href = `/routes/${id}`;
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <FiltersContainer>
                <Input
                    label="Data"
                    type="date"
                    value={filterDate}
                    onChange={(e) => {
                        setFilterDate(e.target.value);
                        setPage(0);
                    }}
                />
                <Select
                    label="Status"
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value as RouteStatus | '');
                        setPage(0);
                    }}
                    options={[
                        { value: '', label: 'Wszystkie' },
                        { value: 'PLANNED', label: 'Zaplanowana' },
                        { value: 'DRIVER_MISSING', label: 'Brak kierowcy' },
                        { value: 'IN_PROGRESS', label: 'W trakcie' },
                        { value: 'COMPLETED', label: 'Zakończona' },
                        { value: 'CANCELLED', label: 'Anulowana' },
                    ]}
                />
            </FiltersContainer>

            {!data?.content.length ? (
                <Card>
                    <Card.Content>
                        <EmptyState>
                            <EmptyIcon>
                                <Truck size={40} />
                            </EmptyIcon>
                            <EmptyText>Brak tras do wyświetlenia</EmptyText>
                            <EmptyHint>
                                {filterDate || filterStatus
                                    ? 'Spróbuj zmienić filtry lub zaplanuj nową trasę'
                                    : 'Zaplanuj swoją pierwszą trasę, aby rozpocząć'}
                            </EmptyHint>
                        </EmptyState>
                    </Card.Content>
                </Card>
            ) : (
                <>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.Head>Trasa</Table.Head>
                                <Table.Head>Kierowca</Table.Head>
                                <Table.Head>Pojazd</Table.Head>
                                <Table.Head>Dzieci</Table.Head>
                                <Table.Head>Godziny</Table.Head>
                                <Table.Head>Status</Table.Head>
                                <Table.Head></Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data.content.map((route) => {
                                const estimatedChildrenCount = Math.ceil(route.stopsCount / 2);
                                const isInProgress = route.status === 'IN_PROGRESS';
                                const isDelayed = route.isDelayed;

                                return (
                                    <RouteRow key={route.id} onClick={() => handleRouteClick(route.id)}>
                                        <Table.Cell>
                                            <RouteInfo>
                                                <RouteName>{route.routeName}</RouteName>
                                                <RouteDate>
                                                    <Calendar size={14} />
                                                    {new Date(route.date).toLocaleDateString('pl-PL', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </RouteDate>
                                            </RouteInfo>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {route.driver ? (
                                                <MetaInfo>
                                                    <User size={16} />
                                                    {route.driver.firstName} {route.driver.lastName}
                                                </MetaInfo>
                                            ) : (
                                                <MetaInfo style={{ color: '#f59e0b', fontStyle: 'italic' }}>
                                                    <User size={16} />
                                                    Nie przypisano
                                                </MetaInfo>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <MetaInfo>
                                                <Truck size={16} />
                                                {route.vehicle.registrationNumber}
                                            </MetaInfo>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <StopsInfo>
                                                <StopsMain>
                                                    <Users size={16} />
                                                    {estimatedChildrenCount}{' '}
                                                    {estimatedChildrenCount === 1 ? 'dziecko' : 'dzieci'}
                                                </StopsMain>
                                                <StopsSub>
                                                    <MapPin size={12} />({route.stopsCount}{' '}
                                                    {route.stopsCount === 1
                                                        ? 'punkt'
                                                        : route.stopsCount < 5
                                                            ? 'punkty'
                                                            : 'punktów'}
                                                    )
                                                </StopsSub>
                                            </StopsInfo>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <MetaInfo>
                                                <Clock size={16} />
                                                {route.estimatedStartTime} - {route.estimatedEndTime}
                                            </MetaInfo>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <StatusBadgeContainer>
                                                {isInProgress ? (
                                                    <PulsingBadge variant={statusVariants[route.status]}>
                                                        {statusLabels[route.status]}
                                                    </PulsingBadge>
                                                ) : (
                                                    <Badge variant={statusVariants[route.status]}>
                                                        {statusLabels[route.status]}
                                                    </Badge>
                                                )}
                                                {isDelayed && (
                                                    <DelayBadge>
                                                        <AlertTriangle size={12} />
                                                        Opóźniona {route.delayMinutes && `(${route.delayMinutes} min)`}
                                                    </DelayBadge>
                                                )}
                                            </StatusBadgeContainer>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <ActionCell>
                                                <ChevronRight size={20} />
                                            </ActionCell>
                                        </Table.Cell>
                                    </RouteRow>
                                );
                            })}
                        </Table.Body>
                    </Table>

                    {data.totalPages > 1 && (
                        <PaginationContainer>
                            <PaginationButton onClick={() => setPage(page - 1)} disabled={data.first}>
                                Poprzednia
                            </PaginationButton>
                            <PageInfo>
                                Strona {page + 1} z {data.totalPages}
                            </PageInfo>
                            <PaginationButton onClick={() => setPage(page + 1)} disabled={data.last}>
                                Następna
                            </PaginationButton>
                        </PaginationContainer>
                    )}
                </>
            )}
        </>
    );
};