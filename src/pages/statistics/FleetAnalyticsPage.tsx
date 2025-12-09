// src/pages/statistics/FleetAnalyticsPage.tsx - MERGED WITH CAPACITY

import React, { useState } from 'react';
import styled from 'styled-components';
import { Truck, Users, AlertCircle, TrendingUp, Package } from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
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
import {
    useFleetTrends,
    useCapacityTrends,
} from '@/features/statistics/hooks/useStatistics';
import {
    getDefaultDateRange,
    getPresetDateRange,
} from '@/features/statistics/lib/dateRangeHelpers';
import {
    calculateAverageFleetUtilization,
    calculateAverageIdleVehicles,
    calculateAverageRoutesWithoutDriver,
    calculateAverageSaturation,
    calculateAverageLowSaturationRoutes,
} from '@/features/statistics/lib/statisticsCalculations';
import {
    transformFleetMetricsToChart,
    transformDriverMetricsToChart,
    transformCapacityMetricsToChart,
    transformToSaturationDistribution,
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
    margin-bottom: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        align-items: stretch;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
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

const SectionDivider = styled.div`
    height: 2px;
    background: ${({ theme }) => theme.gradients.cardHeader};
    margin: ${({ theme }) => theme.spacing['2xl']} 0;
    border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionIcon = styled.div<{ $color: string }>`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    background: ${({ $color }) => $color};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin: 0;
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

const InsightList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.blue[800]};
  line-height: 1.8;
`;

export const FleetAnalyticsPage: React.FC = () => {
    const [dateRange, setDateRange] = useState(getDefaultDateRange());
    const [currentPreset, setCurrentPreset] = useState<
        '7days' | '30days' | '90days' | '180days'
    >('7days');

    const { data: fleetData, isLoading: isFleetLoading } = useFleetTrends(dateRange);
    const { data: capacityData, isLoading: isCapacityLoading } = useCapacityTrends(dateRange);

    const handlePresetChange = (preset: '7days' | '30days' | '90days' | '180days') => {
        setCurrentPreset(preset);
        setDateRange(getPresetDateRange(preset));
    };

    const isLoading = isFleetLoading || isCapacityLoading;

    if (isLoading) {
        return (
            <PageContainer>
                <LoadingSpinner />
            </PageContainer>
        );
    }

    if (!fleetData || !capacityData) {
        return (
            <PageContainer>
                <p>Brak danych</p>
            </PageContainer>
        );
    }

    // Fleet calculations
    const fleetChartData = transformFleetMetricsToChart(fleetData.metrics);
    const driverChartData = transformDriverMetricsToChart(fleetData.metrics);
    const avgFleetUtil = calculateAverageFleetUtilization(fleetData.metrics);
    const avgIdleVehicles = calculateAverageIdleVehicles(fleetData.metrics);
    const avgRoutesWithoutDriver = calculateAverageRoutesWithoutDriver(fleetData.metrics);

    // Capacity calculations
    const capacityChartData = transformCapacityMetricsToChart(capacityData.metrics);
    const distributionData = transformToSaturationDistribution(capacityData.metrics);
    const avgSat = calculateAverageSaturation(capacityData.metrics);
    const avgLowSat = calculateAverageLowSaturationRoutes(capacityData.metrics);

    // Fleet insights
    const peakIdleDay = fleetData.metrics.reduce((max, m) =>
        m.vehiclesAvailable > max.vehiclesAvailable ? m : max
    );
    const daysWithoutDrivers = fleetData.metrics.filter((m) => m.routesWithoutDriver > 0);

    // Capacity insights
    const showCapacityInsight = avgSat < 60 || avgSat > 90 || avgLowSat > 5;

    return (
        <PageContainer>
            <PageHeader>
                <Title>Analiza Floty i Pojemności</Title>
                <Subtitle>
                    Kompleksowy przegląd wykorzystania pojazdów, kierowców oraz efektywności wykorzystania
                    miejsc w pojazdach
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
                    icon={<Truck size={20} />}
                    iconColor="#3b82f6"
                    title="Śr. wykorzystanie floty"
                    value={`${avgFleetUtil}%`}
                    subtitle={`${avgIdleVehicles.toFixed(1)} idle avg`}
                />
                <MetricCard
                    icon={<Users size={20} />}
                    iconColor="#8b5cf6"
                    title="Śr. dostępni kierowcy"
                    value={avgIdleVehicles.toFixed(1)}
                    subtitle="Niewykorzystani"
                />
                <MetricCard
                    icon={<Package size={20} />}
                    iconColor="#3b82f6"
                    title="Średnia saturacja"
                    value={`${avgSat.toFixed(1)}%`}
                    subtitle="Wykorzystanie miejsc"
                />
                <MetricCard
                    icon={<Package size={20} />}
                    iconColor={avgLowSat > 5 ? '#f59e0b' : '#10b981'}
                    title="Trasy < 70%"
                    value={avgLowSat.toFixed(1)}
                    subtitle="Niska saturacja"
                />
                <MetricCard
                    icon={<TrendingUp size={20} />}
                    iconColor="#10b981"
                    title="Łącznie pojazdów"
                    value={fleetData.metrics[fleetData.metrics.length - 1]?.totalVehicles || 0}
                    subtitle="W flocie"
                />
            </MetricsGrid>

            {/* FLEET INSIGHTS */}
            {(peakIdleDay.vehiclesAvailable >= 10 ||
                daysWithoutDrivers.length > 0 ||
                avgFleetUtil > 85 ||
                avgFleetUtil < 60) && (
                <InsightCard>
                    <InsightTitle>💡 Obserwacje - Flota</InsightTitle>
                    <InsightList>
                        {peakIdleDay.vehiclesAvailable >= 10 && (
                            <li>
                                <strong>Pik idle vehicles:</strong> {peakIdleDay.vehiclesAvailable} pojazdów (
                                {peakIdleDay.metricDate}) - dobry moment na serwisy lub utrzymanie
                            </li>
                        )}
                        {daysWithoutDrivers.length > 0 && (
                            <li>
                                <strong>Braki kierowców:</strong> Wykryto {daysWithoutDrivers.length} dni z
                                trasami bez przypisanych kierowców - rozważ zwiększenie kadry lub optymalizację
                                planowania
                            </li>
                        )}
                        {avgFleetUtil > 85 && (
                            <li>
                                <strong>Wysokie wykorzystanie:</strong> Flota wykorzystana w {avgFleetUtil}% -
                                brak rezerwy na nieprzewidziane sytuacje, rozważ powiększenie floty
                            </li>
                        )}
                        {avgFleetUtil < 60 && (
                            <li>
                                <strong>Niskie wykorzystanie:</strong> Flota wykorzystana w {avgFleetUtil}% -
                                możliwość redukcji kosztów lub pozyskania nowych kontraktów
                            </li>
                        )}
                    </InsightList>
                </InsightCard>
            )}

            {/* SECTION 1: FLEET UTILIZATION */}
            <SectionHeader>
                <SectionIcon $color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
                    <Truck size={24} />
                </SectionIcon>
                <SectionTitle>Wykorzystanie Floty</SectionTitle>
            </SectionHeader>

            <ChartCard>
                <ChartTitle>Wykorzystanie pojazdów ({fleetData.metrics.length} dni)</ChartTitle>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={fleetChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="inRoutes"
                            stackId="1"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                            name="W trasach"
                        />
                        <Area
                            type="monotone"
                            dataKey="available"
                            stackId="1"
                            stroke="#94a3b8"
                            fill="#94a3b8"
                            fillOpacity={0.4}
                            name="Dostępne (idle)"
                        />
                        <Line
                            type="monotone"
                            dataKey="totalVehicles"
                            stroke="#1e293b"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Łącznie"
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
                <ChartTitle>Wykorzystanie kierowców ({fleetData.metrics.length} dni)</ChartTitle>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={driverChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="inRoutes"
                            stackId="1"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.6}
                            name="W trasach"
                        />
                        <Area
                            type="monotone"
                            dataKey="available"
                            stackId="1"
                            stroke="#cbd5e1"
                            fill="#cbd5e1"
                            fillOpacity={0.4}
                            name="Dostępni"
                        />
                        <Line
                            type="monotone"
                            dataKey="totalDrivers"
                            stroke="#1e293b"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Łącznie"
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="routesWithoutDriver"
                            stroke="#ef4444"
                            strokeWidth={2}
                            name="Trasy bez kierowcy"
                            dot={{ fill: '#ef4444', r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <SectionDivider />

            {/* SECTION 2: CAPACITY */}
            <SectionHeader>
                <SectionIcon $color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                    <Package size={24} />
                </SectionIcon>
                <SectionTitle>Wykorzystanie Pojemności</SectionTitle>
            </SectionHeader>

            {/* CAPACITY INSIGHTS */}
            {showCapacityInsight && (
                <InsightCard>
                    <InsightTitle>💡 Obserwacje - Pojemność</InsightTitle>
                    <InsightList>
                        {avgSat < 60 && (
                            <li>
                                <strong>Niska saturacja:</strong> Średnia saturacja wynosi tylko{' '}
                                {avgSat.toFixed(1)}%, co wskazuje na znaczne niedostateczne wykorzystanie floty.
                                Rozważ konsolidację tras lub zmniejszenie liczby pojazdów.
                            </li>
                        )}
                        {avgSat > 90 && (
                            <li>
                                <strong>Bardzo wysoka saturacja:</strong> Średnia saturacja wynosi{' '}
                                {avgSat.toFixed(1)}%, co jest bardzo wysokim poziomem. Brak rezerwy na dodatkowych
                                pasażerów - rozważ dodanie tras lub większych pojazdów.
                            </li>
                        )}
                        {avgLowSat > 5 && (
                            <li>
                                <strong>Wiele tras z niską saturacją:</strong> Średnio {avgLowSat.toFixed(1)} tras
                                dziennie ma saturację poniżej 70%. Przeanalizuj te trasy w module Routes w celu
                                ewentualnej konsolidacji.
                            </li>
                        )}
                    </InsightList>
                </InsightCard>
            )}

            <ChartCard>
                <ChartTitle>Trend saturacji w czasie ({capacityData.metrics.length} dni)</ChartTitle>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={capacityChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                            label={{ value: 'Saturacja %', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="3 3" label="Minimum 70%" />
                        <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" label="Wysokie 90%" />
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
                            dataKey="min"
                            stroke="#cbd5e1"
                            strokeDasharray="3 3"
                            name="Min"
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="max"
                            stroke="#1e293b"
                            strokeDasharray="3 3"
                            name="Max"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
                <ChartTitle>Rozkład tras wg saturacji (średnia z okresu)</ChartTitle>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={distributionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#64748b" />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                            label={{ value: 'Liczba tras', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                            }}
                        />
                        <Bar dataKey="count" fill="#f59e0b" name="Liczba tras" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </PageContainer>
    );
};