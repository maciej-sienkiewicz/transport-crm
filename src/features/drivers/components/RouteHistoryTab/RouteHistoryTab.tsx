// src/features/drivers/components/RouteHistoryTab/RouteHistoryTab.tsx
import React, { useState } from 'react';
import { TrendingUp, FileText, Download } from 'lucide-react';
import { useRouteHistory, useRouteHistorySummary } from '../../hooks/useDriverRoutes';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Select } from '@/shared/ui/Select';
import { Table } from '@/shared/ui/Table';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Pagination } from '@/shared/ui/Pagination';
import {
    Container,
    SummarySection,
    SummaryHeader,
    SummaryTitle,
    SummaryGrid,
    SummaryCard,
    SummaryLabel,
    SummaryValue,
    SummarySubtext,
    ChartPlaceholder,
    FiltersBar,
    FilterGroup,
    FilterLabel,
    TableContainer,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptyText,
} from './RouteHistoryTab.styles';

interface RouteHistoryTabProps {
    driverId: string;
}

export const RouteHistoryTab: React.FC<RouteHistoryTabProps> = ({ driverId }) => {
    const [periodDays, setPeriodDays] = useState(30);
    const { data: summary, isLoading: isLoadingSummary } = useRouteHistorySummary(driverId, periodDays);
    const { data: history, isLoading: isLoadingHistory, page, setPage } = useRouteHistory(driverId);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge variant="success">Zakończona</Badge>;
            case 'COMPLETED_WITH_DELAY':
                return <Badge variant="warning">Opóźnienie</Badge>;
            case 'CANCELLED':
                return <Badge variant="danger">Anulowana</Badge>;
            default:
                return <Badge variant="default">{status}</Badge>;
        }
    };

    const handleDownloadReport = (format: 'pdf' | 'csv' | 'excel') => {
        // TODO: Implement download
        console.log('Download report:', format);
    };

    if (isLoadingSummary) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!summary) {
        return (
            <Container>
                <EmptyState>
                    <EmptyIcon>
                        <TrendingUp size={32} />
                    </EmptyIcon>
                    <EmptyTitle>Brak danych</EmptyTitle>
                    <EmptyText>Nie znaleziono historii tras dla tego kierowcy</EmptyText>
                </EmptyState>
            </Container>
        );
    }

    return (
        <Container>
            <SummarySection>
                <SummaryHeader>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <SummaryTitle>📊 Podsumowanie</SummaryTitle>
                        <Select
                            value={periodDays.toString()}
                            onChange={(e) => setPeriodDays(Number(e.target.value))}
                            options={[
                                { value: '7', label: 'Ostatnie 7 dni' },
                                { value: '30', label: 'Ostatnie 30 dni' },
                                { value: '90', label: 'Ostatnie 90 dni' },
                            ]}
                            style={{ width: '200px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button variant="secondary" size="sm" onClick={() => handleDownloadReport('pdf')}>
                            <Download size={14} />
                            PDF
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleDownloadReport('csv')}>
                            <Download size={14} />
                            CSV
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleDownloadReport('excel')}>
                            <Download size={14} />
                            Excel
                        </Button>
                    </div>
                </SummaryHeader>

                <SummaryGrid>
                    <SummaryCard>
                        <SummaryLabel>Wykonanych tras</SummaryLabel>
                        <SummaryValue>{summary.totalRoutes}</SummaryValue>
                    </SummaryCard>
                    <SummaryCard>
                        <SummaryLabel>Godzin w trasie</SummaryLabel>
                        <SummaryValue>{summary.totalHours.toFixed(1)}h</SummaryValue>
                    </SummaryCard>
                    <SummaryCard>
                        <SummaryLabel>Przejechanych km</SummaryLabel>
                        <SummaryValue>{summary.totalKm.toLocaleString('pl-PL')}</SummaryValue>
                    </SummaryCard>
                    <SummaryCard>
                        <SummaryLabel>Średnia ocena</SummaryLabel>
                        <SummaryValue>{summary.averageRating.toFixed(1)}/5.0</SummaryValue>
                        <SummarySubtext>⭐⭐⭐⭐⭐</SummarySubtext>
                    </SummaryCard>
                    <SummaryCard>
                        <SummaryLabel>Punktualność</SummaryLabel>
                        <SummaryValue>{summary.punctualityRate.toFixed(1)}%</SummaryValue>
                        <SummarySubtext>
                            {summary.punctualRoutes}/{summary.totalRoutes} tras
                        </SummarySubtext>
                    </SummaryCard>
                </SummaryGrid>

                <ChartPlaceholder>
                    📈 Wykres aktywności (ostatnie {periodDays} dni)
                </ChartPlaceholder>
            </SummarySection>

            <div>
                <FiltersBar>
                    <FilterGroup>
                        <FilterLabel>Status:</FilterLabel>
                        <Select
                            defaultValue="all"
                            options={[
                                { value: 'all', label: 'Wszystkie' },
                                { value: 'completed', label: 'Zakończone' },
                                { value: 'delayed', label: 'Z opóźnieniem' },
                                { value: 'cancelled', label: 'Anulowane' },
                            ]}
                            style={{ width: '200px' }}
                        />
                    </FilterGroup>
                    <FilterGroup>
                        <FilterLabel>Data:</FilterLabel>
                        <Select
                            defaultValue="all"
                            options={[
                                { value: 'all', label: 'Cały okres' },
                                { value: 'today', label: 'Dzisiaj' },
                                { value: 'week', label: 'Ten tydzień' },
                                { value: 'month', label: 'Ten miesiąc' },
                            ]}
                            style={{ width: '200px' }}
                        />
                    </FilterGroup>
                </FiltersBar>

                {isLoadingHistory ? (
                    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <LoadingSpinner />
                    </div>
                ) : !history || history.content.length === 0 ? (
                    <TableContainer>
                        <EmptyState>
                            <EmptyIcon>
                                <FileText size={32} />
                            </EmptyIcon>
                            <EmptyTitle>Brak tras</EmptyTitle>
                            <EmptyText>Nie znaleziono tras pasujących do wybranych kryteriów</EmptyText>
                        </EmptyState>
                    </TableContainer>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.Head>Data</Table.Head>
                                        <Table.Head>ID</Table.Head>
                                        <Table.Head>Trasa</Table.Head>
                                        <Table.Head>Czas</Table.Head>
                                        <Table.Head>Status</Table.Head>
                                        <Table.Head>Dzieci</Table.Head>
                                        <Table.Head>Dystans</Table.Head>
                                        <Table.Head>Uwagi</Table.Head>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {history.content.map((route) => (
                                        <Table.Row key={route.id}>
                                            <Table.Cell>{route.date}</Table.Cell>
                                            <Table.Cell>{route.routeNumber}</Table.Cell>
                                            <Table.Cell>{route.route}</Table.Cell>
                                            <Table.Cell>
                                                {route.startTime} - {route.endTime}
                                            </Table.Cell>
                                            <Table.Cell>{getStatusBadge(route.status)}</Table.Cell>
                                            <Table.Cell>{route.childrenCount}</Table.Cell>
                                            <Table.Cell>{route.distance} km</Table.Cell>
                                            <Table.Cell>
                                                {route.notes || '-'}
                                                {route.delay && (
                                                    <Badge variant="warning" style={{ marginLeft: '0.5rem' }}>
                                                        +{route.delay} min
                                                    </Badge>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </TableContainer>

                        {history.totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={history.totalPages}
                                onPageChange={setPage}
                            />
                        )}
                    </>
                )}
            </div>
        </Container>
    );
};