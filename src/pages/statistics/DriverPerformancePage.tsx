// src/pages/statistics/DriverPerformancePage.tsx

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Download, TrendingUp, Users, Award } from 'lucide-react';
import { useDriverRanking } from '@/features/statistics/hooks/useStatistics';
import { getDefaultDateRange, getPresetDateRange } from '@/features/statistics/lib/dateRangeHelpers';
import {
    calculateAverageOTD,
    countDriversByOTDRange,
    getOTDBadgeVariant,
    getOTDLabel,
    exportToCSV,
} from '@/features/statistics/lib/statisticsCalculations';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Select } from '@/shared/ui/Select';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import {DateRangePicker} from "@/features/statistics/DateRangePicker/DateRangePicker.tsx";
import {MetricCard} from "@/features/statistics/MetricCard/MetricCard.tsx";

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TableCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.gradients.cardHeader};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TableTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin: 0;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[600]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
  cursor: pointer;
  user-select: none;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[100]};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[100]};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[50]};
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const RankCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 600;
`;

const DriverCell = styled.div`
  font-weight: 500;
`;

const OTDCell = styled.div<{ $otd: number }>`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${({ $otd, theme }) => {
    if ($otd >= 95) return theme.colors.success[600];
    if ($otd >= 90) return theme.colors.warning[600];
    if ($otd >= 85) return theme.colors.orange[600];
    return theme.colors.danger[600];
}};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  color: ${({ theme }) => theme.colors.slate[500]};
`;

type SortField = 'rank' | 'name' | 'otd' | 'stops';
type SortDirection = 'asc' | 'desc';

export const DriverPerformancePage: React.FC = () => {
    const [dateRange, setDateRange] = useState(getDefaultDateRange());
    const [currentPreset, setCurrentPreset] = useState<'7days' | '30days' | '90days' | '180days'>('7days');
    const [otdFilter, setOtdFilter] = useState<'all' | 'excellent' | 'good' | 'fair' | 'poor'>('all');
    const [sortField, setSortField] = useState<SortField>('otd');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const { data, isLoading } = useDriverRanking(dateRange);

    const handlePresetChange = (preset: '7days' | '30days' | '90days' | '180days') => {
        setCurrentPreset(preset);
        setDateRange(getPresetDateRange(preset));
    };

    const filteredAndSortedDrivers = useMemo(() => {
        if (!data?.drivers) return [];

        let filtered = [...data.drivers];

        // Apply OTD filter
        if (otdFilter !== 'all') {
            filtered = filtered.filter((driver) => {
                if (otdFilter === 'excellent') return driver.otdPercentage >= 95;
                if (otdFilter === 'good') return driver.otdPercentage >= 90 && driver.otdPercentage < 95;
                if (otdFilter === 'fair') return driver.otdPercentage >= 85 && driver.otdPercentage < 90;
                if (otdFilter === 'poor') return driver.otdPercentage < 85;
                return true;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let compareValue = 0;

            if (sortField === 'name') {
                compareValue = a.driverName.localeCompare(b.driverName);
            } else if (sortField === 'otd') {
                compareValue = a.otdPercentage - b.otdPercentage;
            } else if (sortField === 'stops') {
                compareValue = a.totalStops - b.totalStops;
            }

            return sortDirection === 'asc' ? compareValue : -compareValue;
        });

        return filtered;
    }, [data, otdFilter, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const handleExport = () => {
        if (!filteredAndSortedDrivers.length) return;

        const exportData = filteredAndSortedDrivers.map((driver, index) => ({
            Pozycja: index + 1,
            Kierowca: driver.driverName,
            'OTD %': driver.otdPercentage.toFixed(1),
            'Przystanki': driver.totalStops,
            'Na czas': driver.ontimeStops,
            'Spóźnione': driver.lateStops,
            'Śr. opóźnienie (min)': driver.avgDelayMinutes,
            'Maks. opóźnienie (min)': driver.maxDelayMinutes,
        }));

        exportToCSV(exportData, `wydajnosc-kierowcow-${dateRange.startDate}-${dateRange.endDate}`);
    };

    const handleDriverClick = (driverId: string) => {
        window.history.pushState({}, '', `/statistics/drivers/${driverId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingSpinner />
            </PageContainer>
        );
    }

    const avgOTD = data ? calculateAverageOTD(data.drivers) : 0;
    const excellentDrivers = data ? countDriversByOTDRange(data.drivers, 95, 100) : 0;
    const poorDrivers = data ? countDriversByOTDRange(data.drivers, 0, 85) : 0;
    const totalDrivers = data?.drivers.length || 0;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Wydajność Kierowców</Title>
                <Subtitle>
                    Analiza punktualności i wydajności kierowców na podstawie wskaźnika OTD (On-Time Delivery)
                </Subtitle>
                <Controls>
                    <DateRangePicker
                        dateRange={dateRange}
                        onPresetChange={handlePresetChange}
                        currentPreset={currentPreset}
                    />
                </Controls>
            </PageHeader>

            <MetricsGrid>
                <MetricCard
                    icon={<TrendingUp size={20} />}
                    iconColor="#10b981"
                    title="Średnie OTD"
                    value={`${avgOTD.toFixed(1)}%`}
                    subtitle="Wszystkie kierowcy"
                />
                <MetricCard
                    icon={<Award size={20} />}
                    iconColor="#3b82f6"
                    title="Top Performers"
                    value={excellentDrivers}
                    subtitle="OTD ≥ 95%"
                />
                <MetricCard
                    icon={<Users size={20} />}
                    iconColor="#8b5cf6"
                    title="Łącznie kierowców"
                    value={totalDrivers}
                    subtitle="W tym okresie"
                />
                <MetricCard
                    icon={<Users size={20} />}
                    iconColor={poorDrivers > 0 ? "#ef4444" : "#10b981"}
                    title="Wymaga uwagi"
                    value={poorDrivers}
                    subtitle="OTD < 85%"
                />
            </MetricsGrid>

            <TableCard>
                <TableHeader>
                    <TableTitle>Ranking Kierowców ({filteredAndSortedDrivers.length})</TableTitle>
                    <FilterGroup>
                        <Select
                            value={otdFilter}
                            onChange={(e) => setOtdFilter(e.target.value as any)}
                            options={[
                                { value: 'all', label: 'Wszyscy' },
                                { value: 'excellent', label: 'Doskonały (≥95%)' },
                                { value: 'good', label: 'Dobry (90-94%)' },
                                { value: 'fair', label: 'Akceptowalny (85-89%)' },
                                { value: 'poor', label: 'Wymaga uwagi (<85%)' },
                            ]}
                        />
                        <Button size="sm" variant="secondary" onClick={handleExport}>
                            <Download size={14} />
                            Export CSV
                        </Button>
                    </FilterGroup>
                </TableHeader>

                {filteredAndSortedDrivers.length === 0 ? (
                    <EmptyState>Brak kierowców spełniających kryteria filtrowania</EmptyState>
                ) : (
                    <Table>
                        <thead>
                        <tr>
                            <Th onClick={() => handleSort('rank')}>Pozycja</Th>
                            <Th onClick={() => handleSort('name')}>Kierowca</Th>
                            <Th onClick={() => handleSort('otd')}>OTD %</Th>
                            <Th>Status</Th>
                            <Th onClick={() => handleSort('stops')}>Przystanki</Th>
                            <Th>Na czas</Th>
                            <Th>Spóźnione</Th>
                            <Th>Śr. opóźnienie</Th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredAndSortedDrivers.map((driver, index) => (
                            <Tr key={driver.driverId} onClick={() => handleDriverClick(driver.driverId)}>
                                <Td>
                                    <RankCell>
                                        {index === 0 && '🥇'}
                                        {index === 1 && '🥈'}
                                        {index === 2 && '🥉'}
                                        {index + 1}
                                    </RankCell>
                                </Td>
                                <Td>
                                    <DriverCell>{driver.driverName}</DriverCell>
                                </Td>
                                <Td>
                                    <OTDCell $otd={driver.otdPercentage}>
                                        {driver.otdPercentage.toFixed(1)}%
                                    </OTDCell>
                                </Td>
                                <Td>
                                    <Badge variant={getOTDBadgeVariant(driver.otdPercentage)}>
                                        {getOTDLabel(driver.otdPercentage)}
                                    </Badge>
                                </Td>
                                <Td>{driver.totalStops}</Td>
                                <Td>{driver.ontimeStops}</Td>
                                <Td>{driver.lateStops}</Td>
                                <Td>{driver.avgDelayMinutes} min</Td>
                            </Tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </TableCard>
        </PageContainer>
    );
};