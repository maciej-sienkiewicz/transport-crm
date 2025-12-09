// src/pages/statistics/ServiceQualityPage.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { Clock, AlertTriangle } from 'lucide-react';
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
import { usePassengerTrends } from '@/features/statistics/hooks/useStatistics';
import {
    getDefaultDateRange,
    getPresetDateRange,
} from '@/features/statistics/lib/dateRangeHelpers';
import {
    calculateAverageTripDuration,
    calculateAverageP90Duration,
} from '@/features/statistics/lib/statisticsCalculations';
import {
    transformPassengerMetricsToChart,
    transformToDurationDistribution,
} from '@/features/statistics/lib/chartDataTransformers';
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

const WarningCard = styled.div`
  background: ${({ theme }) => theme.colors.orange[50]};
  border: 1px solid ${({ theme }) => theme.colors.orange[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InsightTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const WarningTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.orange[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InsightText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.blue[800]};
  line-height: 1.6;
  margin: 0;
`;

const WarningText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.orange[800]};
  line-height: 1.6;
  margin: 0;
`;

const WarningContent = styled.div`
  flex: 1;
`;

export const ServiceQualityPage: React.FC = () => {
    const [dateRange, setDateRange] = useState(getDefaultDateRange());
    const [currentPreset, setCurrentPreset] = useState<
        '7days' | '30days' | '90days' | '180days'
    >('7days');

    const { data, isLoading } = usePassengerTrends(dateRange);

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

    const chartData = transformPassengerMetricsToChart(data.metrics);
    const distributionData = transformToDurationDistribution(data.metrics);
    const avgDuration = calculateAverageTripDuration(data.metrics);
    const avgP90 = calculateAverageP90Duration(data.metrics);

    // Calculate total trips
    const totalTrips = data.metrics.reduce((sum, m) => sum + m.totalTrips, 0);

    // Find days with P90 > 45
    const daysOverTarget = data.metrics.filter((m) => m.p90TripDurationMinutes > 45);

    const showWarning = avgP90 > 45;
    const showInsight = avgDuration > 35 || daysOverTarget.length > 0;

    return (
        <PageContainer>
            <Title>Jakość Usługi</Title>
            <Subtitle>
                Czas przejazdu dzieci (od pickupu do dropoffu) - monitoring komfortu pasażerów
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
                    icon={<Clock size={20} />}
                    iconColor="#3b82f6"
                    title="Średni czas"
                    value={`${avgDuration} min`}
                    subtitle="Wszystkie przejazdy"
                />
                <MetricCard
                    icon={<Clock size={20} />}
                    iconColor={avgP90 > 45 ? '#ef4444' : '#10b981'}
                    title="P90"
                    value={`${avgP90} min`}
                    subtitle="90% przejazdów"
                />
                <MetricCard
                    icon={<Clock size={20} />}
                    iconColor="#8b5cf6"
                    title="Łącznie przejazdów"
                    value={totalTrips}
                    subtitle="W okresie"
                />
            </MetricsGrid>

            {showWarning && (
                <WarningCard>
                    <AlertTriangle size={24} color="#f59e0b" />
                    <WarningContent>
                        <WarningTitle>⚠️ Przekroczony cel jakości</WarningTitle>
                        <WarningText>
                            P90 wynosi {avgP90} min, co jest powyżej docelowych 45 minut. Oznacza to, że 10%
                            dzieci spędza w pojeździe ponad 45 minut. Przeanalizuj trasy w module Routes w celu
                            optymalizacji sekwencji przystanków.
                        </WarningText>
                    </WarningContent>
                </WarningCard>
            )}

            {showInsight && !showWarning && (
                <InsightCard>
                    <InsightTitle>💡 Obserwacje</InsightTitle>
                    <InsightText>
                        {avgDuration > 35 && (
                            <>
                                Średni czas przejazdu wynosi {avgDuration} min. Choć P90 jest w normie, średnia
                                jest podwyższona - sprawdź czy niektóre trasy nie są zbyt długie.
                            </>
                        )}
                        {daysOverTarget.length > 0 && (
                            <>
                                {' '}
                                W {daysOverTarget.length} dniach P90 przekroczyło 45 min. Sprawdź te konkretne dni
                                w szczegółach tras.
                            </>
                        )}
                    </InsightText>
                </InsightCard>
            )}

            <ChartCard>
                <ChartTitle>Czas przejazdu w czasie ({data.metrics.length} dni)</ChartTitle>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis
                            domain={[0, 80]}
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                            label={{ value: 'Czas (minuty)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <ReferenceLine y={45} stroke="#ef4444" strokeDasharray="3 3" label="Cel < 45 min" />
                        <Line
                            type="monotone"
                            dataKey="avg"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Średnia"
                            dot={{ fill: '#3b82f6', r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="p50"
                            stroke="#10b981"
                            strokeDasharray="3 3"
                            name="Mediana (P50)"
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="p90"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            name="P90"
                            dot={{ fill: '#f59e0b', r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="p99"
                            stroke="#ef4444"
                            strokeDasharray="3 3"
                            name="P99 (outliers)"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
                <ChartTitle>Rozkład czasu przejazdu (wszystkie przejazdy)</ChartTitle>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={distributionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                            label={{ value: 'Liczba przejazdów', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" name="Liczba przejazdów" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </PageContainer>
    );
};