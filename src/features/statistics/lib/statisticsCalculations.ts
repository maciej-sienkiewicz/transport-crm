// src/features/statistics/lib/statisticsCalculations.ts

import {
    FleetMetric,
    CapacityMetric,
    WorkloadMetric,
    PassengerMetric,
    DriverPerformanceSummary,
    TrendIndicator,
    DailyDriverPerformance,
} from '../api/types';

/**
 * Calculate average of an array of numbers
 */
export const calculateAverage = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / numbers.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
};

/**
 * Create trend indicator from current and previous values
 */
export const createTrendIndicator = (
    current: number,
    previous: number
): TrendIndicator => {
    const change = calculatePercentageChange(current, previous);
    const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

    return {
        value: current,
        change: Math.abs(change),
        direction,
    };
};

// ============================================
// FLEET METRICS CALCULATIONS
// ============================================

export const calculateFleetUtilization = (metric: FleetMetric): number => {
    if (metric.totalVehicles === 0) return 0;
    return Math.round((metric.vehiclesInRoutes / metric.totalVehicles) * 100);
};

export const calculateDriverUtilization = (metric: FleetMetric): number => {
    if (metric.totalDrivers === 0) return 0;
    return Math.round((metric.driversInRoutes / metric.totalDrivers) * 100);
};

export const calculateAverageFleetUtilization = (metrics: FleetMetric[]): number => {
    const utilizations = metrics.map(calculateFleetUtilization);
    return calculateAverage(utilizations);
};

export const calculateAverageIdleVehicles = (metrics: FleetMetric[]): number => {
    const idleVehicles = metrics.map((m) => m.vehiclesAvailable);
    return calculateAverage(idleVehicles);
};

export const calculateAverageRoutesWithoutDriver = (metrics: FleetMetric[]): number => {
    const routesWithoutDriver = metrics.map((m) => m.routesWithoutDriver);
    return calculateAverage(routesWithoutDriver);
};

// ============================================
// CAPACITY METRICS CALCULATIONS
// ============================================

export const calculateAverageSaturation = (metrics: CapacityMetric[]): number => {
    const saturations = metrics.map((m) => m.avgSaturationPercent);
    return calculateAverage(saturations);
};

export const calculateAverageLowSaturationRoutes = (metrics: CapacityMetric[]): number => {
    const lowSatRoutes = metrics.map((m) => m.routesLowSaturation);
    return calculateAverage(lowSatRoutes);
};

// ============================================
// WORKLOAD METRICS CALCULATIONS
// ============================================

export const calculateWorkloadBalance = (metric: WorkloadMetric): 'good' | 'fair' | 'poor' => {
    if (metric.stdDevStops < 5) return 'good';
    if (metric.stdDevStops < 10) return 'fair';
    return 'poor';
};

// ============================================
// PASSENGER METRICS CALCULATIONS
// ============================================

export const calculateAverageTripDuration = (metrics: PassengerMetric[]): number => {
    const durations = metrics.map((m) => m.avgTripDurationMinutes);
    return calculateAverage(durations);
};

export const calculateAverageP90Duration = (metrics: PassengerMetric[]): number => {
    const p90Durations = metrics.map((m) => m.p90TripDurationMinutes);
    return calculateAverage(p90Durations);
};

// ============================================
// DRIVER PERFORMANCE CALCULATIONS
// ============================================

export const calculateAverageOTD = (drivers: DriverPerformanceSummary[]): number => {
    const otds = drivers.map((d) => d.otdPerformance);
    return calculateAverage(otds);
};

export const countDriversByOTDRange = (
    drivers: DriverPerformanceSummary[],
    min: number,
    max: number
): number => {
    return drivers.filter((d) => d.otdPercentage >= min && d.otdPercentage < max).length;
};

export const getOTDBadgeVariant = (
    otd: number
): 'success' | 'warning' | 'danger' | 'default' => {
    if (otd >= 95) return 'success';
    if (otd >= 90) return 'warning';
    if (otd >= 85) return 'danger';
    return 'danger';
};

export const getOTDLabel = (otd: number): string => {
    if (otd >= 95) return 'Doskonały';
    if (otd >= 90) return 'Dobry';
    if (otd >= 85) return 'Akceptowalny';
    return 'Wymaga uwagi';
};

/**
 * Group daily performance by week for trend analysis
 */
export const groupByWeek = (
    dailyBreakdown: DailyDriverPerformance[]
): Array<{ week: string; avgOTD: number; totalStops: number }> => {
    const weeks = new Map<string, { stops: number[]; otds: number[] }>();

    dailyBreakdown.forEach((day) => {
        const date = new Date(day.metricDate);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeks.has(weekKey)) {
            weeks.set(weekKey, { stops: [], otds: [] });
        }

        const week = weeks.get(weekKey)!;
        week.stops.push(day.totalStops);
        week.otds.push(day.otdPercentage);
    });

    return Array.from(weeks.entries()).map(([week, data]) => ({
        week,
        avgOTD: calculateAverage(data.otds),
        totalStops: data.stops.reduce((sum, s) => sum + s, 0),
    }));
};

/**
 * Analyze delay patterns for a driver
 */
export const analyzeDelayPatterns = (dailyBreakdown: DailyDriverPerformance[]) => {
    const delays = dailyBreakdown
        .filter((d) => d.lateStops > 0)
        .map((d) => d.avgDelayMinutes);

    if (delays.length === 0) {
        return {
            avgDelay: 0,
            maxDelay: 0,
            commonDelayRange: 'Brak opóźnień',
        };
    }

    const avgDelay = calculateAverage(delays);
    const maxDelay = Math.max(...delays);

    // Determine common delay range
    let commonDelayRange = '';
    if (avgDelay < 5) {
        commonDelayRange = '0-5 minut';
    } else if (avgDelay < 10) {
        commonDelayRange = '5-10 minut';
    } else if (avgDelay < 15) {
        commonDelayRange = '10-15 minut';
    } else {
        commonDelayRange = '15+ minut';
    }

    return {
        avgDelay,
        maxDelay,
        commonDelayRange,
    };
};

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string): void => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map((row) =>
            headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
        ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};