// src/pages/statistics/DriverDetailPage.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import {
    ArrowLeft,
    TrendingDown,
    TrendingUp,
    Clock,
    AlertTriangle,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { useDriverPerformance } from '@/features/statistics/hooks/useStatistics';
import { getPresetDateRange } from '@/features/statistics/lib/dateRangeHelpers';
import {
    getOTDBadgeVariant,
    getOTDLabel,
    analyzeDelayPatterns,
} from '@/features/statistics/lib/statisticsCalculations';
import {
    transformDriverPerformanceToChart,
    transformToDelayDistribution,
} from '@/features/statistics/lib/chartDataTransformers';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
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

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const DriverInfo = styled.div`
  flex: 1;
`;

const DriverName = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DriverMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ChartCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ChartTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InsightCard = styled.div`
  background: ${({ theme }) => theme.colors.blue[50]};
  border: 1px solid ${({ theme }) => theme.colors.blue[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const InsightTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InsightText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.blue[800]};
  line-height: 1.6;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[600]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[100]};
  font-size: 0.875rem;
`;

const Tr = styled.tr<{ $isLow?: boolean }>`
  background: ${({ $isLow, theme }) => ($isLow ? theme.colors.danger[50] : 'transparent')};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[50]};
  }
`;

interface DriverDetailPageProps {
    id: string;
}

export const DriverDetailPage: React.FC<DriverDetailPageProps> = ({ id }) => {
    const [dateRange, setDateRange] = useState(getPresetDateRange('30days'));
    const [currentPreset, setCurrentPreset] = useState<'7days' | '30days' | '90days' | '180days'>('30days');

    const { data, isLoading } = useDriverPerformance(id, dateRange);

    const handlePresetChange = (preset: '7days' | '30days' | '90days' | '180days') => {
        setCurrentPreset(preset);
        setDateRange(getPresetDateRange(preset));
    };

    const handleBack = () => {
        window.history.pushState({}, '', '/statistics/drivers');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingSpinner />
            </PageContainer>
        );
    }

    if (!data) {
        return (
            <PageContainer>
                <BackButton variant="ghost" onClick={handleBack}>
                    <ArrowLeft size={16} />
                    Powrót
                </BackButton>
                <p>Nie znaleziono danych kierowcy</p>
            </PageContainer>
        );
    }

    const chartData = transformDriverPerformanceToChart(data.dailyBreakdown);
    const delayDistribution = transformToDelayDistribution(data.dailyBreakdown);
    const delayAnalysis = analyzeDelayPatterns(data.dailyBreakdown);

    // Calculate week-over-week change if we have enough data
    const firstWeekAvgOTD =
        data.dailyBreakdown.length > 7
            ? data.dailyBreakdown
            .slice(0, 7)
            .reduce((sum, d) => sum + d.otdPercentage, 0) / 7
            : 0;

    const lastWeekAvgOTD =
        data.dailyBreakdown.length > 7
            ? data.dailyBreakdown
            .slice(-7)
            .reduce((sum, d) => sum + d.otdPercentage, 0) / 7
            : data.otdPercentage;

    const weekOverWeekChange =
        firstWeekAvgOTD > 0
            ? ((lastWeekAvgOTD - firstWeekAvgOTD) / firstWeekAvgOTD) * 100
            : 0;

    return (
        <PageContainer>
            <BackButton variant="ghost" onClick={handleBack}>
                <ArrowLeft size={16} />
                Powrót do rankingu
            </BackButton>

            <Header>
                <HeaderTop>
                    <DriverInfo>
                        <DriverName>{data.driverName}</DriverName>
                        <DriverMeta>
                            <MetaItem>ID: {data.driverId}</MetaItem>
                            <MetaItem>Okres: {data.period}</MetaItem>
                            <Badge variant={getOTDBadgeVariant(data.otdPercentage)}>
                                {getOTDLabel(data.otdPercentage)}
                            </Badge>
                        </DriverMeta>
                    </DriverInfo>
                    <DateRangePicker
                        dateRange={dateRange}
                        onPresetChange={handlePresetChange}
                        currentPreset={currentPreset}
                    />
                </HeaderTop>

                <MetricsGrid>
                    <MetricCard
                        icon={<TrendingUp size={20} />}
                        iconColor="#3b82f6"
                        title="OTD"
                        value={`${data.otdPercentage.toFixed(1)}%`}
                        trend={
                            weekOverWeekChange !== 0
                                ? {
                                    direction: weekOverWeekChange > 0 ? 'up' : 'down',
                                    value: Math.abs(Math.round(weekOverWeekChange)),
                                }
                                : undefined
                        }
                        subtitle="Ogólny wskaźnik"
                    />
                    <MetricCard
                        icon={<Clock size={20} />}
                        iconColor="#f59e0b"
                        title="Przystanki"
                        value={data.totalStops}
                        subtitle={`${data.lateStops} spóźnionych`}
                    />
                    <MetricCard
                        icon={<AlertTriangle size={20} />}
                        iconColor="#ef4444"
                        title="Średnie opóźnienie"
                        value={`${delayAnalysis.avgDelay} min`}
                        subtitle={delayAnalysis.commonDelayRange}
                    />
                    <MetricCard
                        icon={<TrendingDown size={20} />}
                        iconColor="#dc2626"
                        title="Maks opóźnienie"
                        value={`${delayAnalysis.maxDelay} min`}
                        subtitle="W okresie"
                    />
                </MetricsGrid>
            </Header>

            {data.otdPercentage < 85 && (
                <InsightCard>
                    <InsightTitle>
                        <AlertTriangle size={16} />
                        Wymaga uwagi
                    </InsightTitle>
                    <InsightText>
                        OTD kierowcy wynosi {data.otdPercentage.toFixed(1)}%, co jest poniżej oczekiwanego
                        poziomu 85%. Najczęstsze opóźnienia to {delayAnalysis.commonDelayRange}. Rozważ
                        spotkanie z kierowcą w celu omówienia przyczyn i zaproponowania rozwiązań.
                    </InsightText>
                </InsightCard>
            )}

            <ChartCard>
                <ChartTitle>Trend OTD (ostatnie {data.dailyBreakdown.length} dni)</ChartTitle>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                            label={{ value: 'OTD %', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="3 3" label="Minimum 85%" />
                        <ReferenceLine y={95} stroke="#10b981" strokeDasharray="3 3" label="Cel 95%" />
                        <Line
                            type="monotone"
                            dataKey="otd"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="OTD %"
                            dot={{ fill: '#3b82f6', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
                <ChartTitle>Rozkład opóźnień</ChartTitle>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={delayDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Bar dataKey="count" fill="#f59e0b" name="Liczba spóźnień" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
                <ChartTitle>Dzienne rozbicie (ostatnie 7 dni)</ChartTitle>
                <Table>
                    <thead>
                    <tr>
                        <Th>Data</Th>
                        <Th>Przystanki</Th>
                        <Th>Na czas</Th>
                        <Th>Spóźnione</Th>
                        <Th>OTD %</Th>
                        <Th>Śr. opóźnienie</Th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.dailyBreakdown.slice(-7).reverse().map((day) => (
                        <Tr key={day.metricDate} $isLow={day.otdPercentage < 85}>
                            <Td>{day.metricDate}</Td>
                            <Td>{day.totalStops}</Td>
                            <Td>{day.ontimeStops}</Td>
                            <Td>{day.lateStops}</Td>
                            <Td>
                                <strong>{day.otdPercentage.toFixed(1)}%</strong>
                            </Td>
                            <Td>{day.avgDelayMinutes} min</Td>
                        </Tr>
                    ))}
                    </tbody>
                </Table>
            </ChartCard>
        </PageContainer>
    );
};