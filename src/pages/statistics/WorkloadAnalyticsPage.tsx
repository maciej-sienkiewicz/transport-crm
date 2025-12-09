// src/pages/statistics/WorkloadAnalyticsPage.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { Activity, TrendingUp } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { useWorkloadTrends } from '@/features/statistics/hooks/useStatistics';
import {
    getDefaultDateRange,
    getPresetDateRange,
} from '@/features/statistics/lib/dateRangeHelpers';
import { calculateWorkloadBalance } from '@/features/statistics/lib/statisticsCalculations';
import { transformWorkloadMetricsToChart } from '@/features/statistics/lib/chartDataTransformers';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import {MetricCard} from "@/features/statistics/MetricCard/MetricCard.tsx";
import {DateRangePicker} from "@/features/statistics/DateRangePicker/DateRangePicker.tsx";

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
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
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.xl} 0;
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
`;

const InsightText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.blue[800]};
  line-height: 1.6;
  margin: 0;
`;

export const WorkloadAnalyticsPage: React.FC = () => {
    const [dateRange, setDateRange] = useState(getDefaultDateRange());
    const [currentPreset, setCurrentPreset] = useState<
        '7days' | '30days' | '90days' | '180days'
    >('7days');

    const { data, isLoading } = useWorkloadTrends(dateRange);

    const handlePresetChange = (preset: '7days' | '30days' | '90days' | '180days') => {
        setCurrentPreset(preset);
        setDateRange(getPresetDateRange(preset));
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
                <p>Brak danych</p>
            </PageContainer>
        );
    }

    const chartData = transformWorkloadMetricsToChart(data.metrics);

    // Calculate average metrics
    const avgStops =
        data.metrics.reduce((sum, m) => sum + m.avgStopsPerVehicle, 0) / data.metrics.length;
    const avgStdDev =
        data.metrics.reduce((sum, m) => sum + m.stdDevStops, 0) / data.metrics.length;

    // Find worst day (highest std dev)
    const worstDay = data.metrics.reduce((max, m) =>
        m.stdDevStops > max.stdDevStops ? m : max
    );

    const balance = calculateWorkloadBalance(worstDay);
    const balanceColor =
        balance === 'good' ? '#10b981' : balance === 'fair' ? '#f59e0b' : '#ef4444';
    const balanceLabel =
        balance === 'good' ? 'Dobrze zbalansowane' : balance === 'fair' ? 'Średnio' : 'Źle';

    const showInsight = avgStdDev > 8;

    return (
        <PageContainer>
            <Title>Analiza Obciążenia</Title>
            <Subtitle>
                Rozkład przystanków na pojazdy i kierowców - sprawdzanie równomierności obciążenia
            </Subtitle>

            <Controls>
                <DateRangePicker
                    dateRange={dateRange}
                    onPresetChange={handlePresetChange}
                    currentPreset={currentPreset}
                />
            </Controls>

            <MetricsGrid>
                <MetricCard
                    icon={<Activity size={20} />}
                    iconColor="#3b82f6"
                    title="Śr. przystanki/pojazd"
                    value={avgStops.toFixed(1)}
                    subtitle="W okresie"
                />
                <MetricCard
                    icon={<TrendingUp size={20} />}
                    iconColor={balanceColor}
                    title="Balans obciążenia"
                    value={balanceLabel}
                    subtitle={`Std dev: ${avgStdDev.toFixed(1)}`}
                />
            </MetricsGrid>

            {showInsight && (
                <InsightCard>
                    <InsightTitle>💡 Obserwacje</InsightTitle>
                    <InsightText>
                        Średnie odchylenie standardowe wynosi {avgStdDev.toFixed(1)}, co wskazuje na{' '}
                        {avgStdDev > 10 ? 'znaczną' : 'zauważalną'} nierównomierność obciążenia. Najgorszy
                        dzień to {worstDay.metricDate} (std dev: {worstDay.stdDevStops.toFixed(1)}). Rozważ
                        przegląd algorytmu planowania tras w celu lepszego rozłożenia przystanków między
                        pojazdy.
                    </InsightText>
                </InsightCard>
            )}

            <ChartCard>
                <ChartTitle>Obciążenie pojazdów (przystanki/dzień)</ChartTitle>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                            label={{ value: 'Liczba przystanków', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="avgStops"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Średnia"
                            dot={{ fill: '#3b82f6', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="minStops"
                            stroke="#10b981"
                            strokeDasharray="3 3"
                            name="Min"
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="maxStops"
                            stroke="#ef4444"
                            strokeDasharray="3 3"
                            name="Max"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
                <ChartTitle>Balans obciążenia (odchylenie standardowe)</ChartTitle>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                            label={{ value: 'Std Dev', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <ReferenceLine
                            y={5}
                            stroke="#10b981"
                            strokeDasharray="3 3"
                            label="Dobrze (<5)"
                        />
                        <ReferenceLine
                            y={10}
                            stroke="#ef4444"
                            strokeDasharray="3 3"
                            label="Źle (>10)"
                        />
                        <Line
                            type="monotone"
                            dataKey="stdDev"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            name="Std Dev"
                            dot={{ fill: '#8b5cf6', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </PageContainer>
    );
};