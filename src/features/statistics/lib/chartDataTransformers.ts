// src/features/statistics/lib/chartDataTransformers.ts

import {
    FleetMetric,
    CapacityMetric,
    WorkloadMetric,
    PassengerMetric,
    DailyDriverPerformance,
} from '../api/types';
import { formatDateDisplay } from './dateRangeHelpers';

// ============================================
// FLEET CHARTS DATA
// ============================================

export interface FleetUtilizationChartData {
    date: string;
    totalVehicles: number;
    inRoutes: number;
    available: number;
}

export const transformFleetMetricsToChart = (
    metrics: FleetMetric[]
): FleetUtilizationChartData[] => {
    return metrics.map((m) => ({
        date: formatDateDisplay(m.metricDate),
        totalVehicles: m.totalVehicles,
        inRoutes: m.vehiclesInRoutes,
        available: m.vehiclesAvailable,
    }));
};

export interface DriverUtilizationChartData {
    date: string;
    totalDrivers: number;
    inRoutes: number;
    available: number;
    routesWithoutDriver: number;
}

export const transformDriverMetricsToChart = (
    metrics: FleetMetric[]
): DriverUtilizationChartData[] => {
    return metrics.map((m) => ({
        date: formatDateDisplay(m.metricDate),
        totalDrivers: m.totalDrivers,
        inRoutes: m.driversInRoutes,
        available: m.driversAvailable,
        routesWithoutDriver: m.routesWithoutDriver,
    }));
};

// ============================================
// CAPACITY CHARTS DATA
// ============================================

export interface SaturationChartData {
    date: string;
    avg: number;
    min: number;
    max: number;
    totalRoutes: number;
    lowSaturation: number;
}

export const transformCapacityMetricsToChart = (
    metrics: CapacityMetric[]
): SaturationChartData[] => {
    return metrics.map((m) => ({
        date: formatDateDisplay(m.metricDate),
        avg: Math.round(m.avgSaturationPercent * 10) / 10,
        min: Math.round(m.minSaturationPercent * 10) / 10,
        max: Math.round(m.maxSaturationPercent * 10) / 10,
        totalRoutes: m.totalRoutes,
        lowSaturation: m.routesLowSaturation,
    }));
};

export interface SaturationDistributionData {
    range: string;
    count: number;
}

export const transformToSaturationDistribution = (
    metrics: CapacityMetric[]
): SaturationDistributionData[] => {
    // Calculate average across all days
    const avgLowSat = Math.round(
        metrics.reduce((sum, m) => sum + m.routesLowSaturation, 0) / metrics.length
    );

    // Estimate other buckets based on total routes and low saturation
    const avgTotalRoutes = Math.round(
        metrics.reduce((sum, m) => sum + m.totalRoutes, 0) / metrics.length
    );

    const optimalSat = Math.max(0, Math.round(avgTotalRoutes * 0.6)); // Estimate 60% in optimal range
    const highSat = Math.max(0, avgTotalRoutes - avgLowSat - optimalSat);
    const veryLowSat = Math.max(0, Math.round(avgLowSat * 0.3)); // Estimate 30% of low are very low

    return [
        { range: '< 50%', count: veryLowSat },
        { range: '50-70%', count: avgLowSat - veryLowSat },
        { range: '70-90%', count: optimalSat },
        { range: '> 90%', count: highSat },
    ];
};

// ============================================
// WORKLOAD CHARTS DATA
// ============================================

export interface WorkloadChartData {
    date: string;
    avgStops: number;
    minStops: number;
    maxStops: number;
    stdDev: number;
}

export const transformWorkloadMetricsToChart = (
    metrics: WorkloadMetric[]
): WorkloadChartData[] => {
    return metrics.map((m) => ({
        date: formatDateDisplay(m.metricDate),
        avgStops: Math.round(m.avgStopsPerVehicle * 10) / 10,
        minStops: m.minStopsPerVehicle,
        maxStops: m.maxStopsPerVehicle,
        stdDev: Math.round(m.stdDevStops * 10) / 10,
    }));
};

// ============================================
// PASSENGER TRIP DURATION CHARTS DATA
// ============================================

export interface TripDurationChartData {
    date: string;
    avg: number;
    p50: number;
    p90: number;
    p99: number;
}

export const transformPassengerMetricsToChart = (
    metrics: PassengerMetric[]
): TripDurationChartData[] => {
    return metrics.map((m) => ({
        date: formatDateDisplay(m.metricDate),
        avg: Math.round(m.avgTripDurationMinutes),
        p50: m.p50TripDurationMinutes,
        p90: m.p90TripDurationMinutes,
        p99: m.p99TripDurationMinutes,
    }));
};

export interface DurationDistributionData {
    range: string;
    count: number;
}

export const transformToDurationDistribution = (
    metrics: PassengerMetric[]
): DurationDistributionData[] => {
    // Estimate distribution based on percentiles
    const avgTotal = Math.round(
        metrics.reduce((sum, m) => sum + m.totalTrips, 0) / metrics.length
    );

    // Rough estimation of buckets
    const under30 = Math.round(avgTotal * 0.5); // ~50% under median
    const range30_45 = Math.round(avgTotal * 0.35); // ~35% between median and p90
    const range45_60 = Math.round(avgTotal * 0.10); // ~10% between p90 and p99
    const over60 = Math.max(0, avgTotal - under30 - range30_45 - range45_60);

    return [
        { range: '< 30 min', count: under30 },
        { range: '30-45 min', count: range30_45 },
        { range: '45-60 min', count: range45_60 },
        { range: '> 60 min', count: over60 },
    ];
};

// ============================================
// DRIVER PERFORMANCE CHARTS DATA
// ============================================

export interface DriverOTDChartData {
    date: string;
    otd: number;
    stops: number;
    lateStops: number;
}

export const transformDriverPerformanceToChart = (
    dailyBreakdown: DailyDriverPerformance[]
): DriverOTDChartData[] => {
    return dailyBreakdown.map((day) => ({
        date: formatDateDisplay(day.metricDate),
        otd: Math.round(day.otdPercentage * 10) / 10,
        stops: day.totalStops,
        lateStops: day.lateStops,
    }));
};

export interface DelayDistributionData {
    range: string;
    count: number;
}

export const transformToDelayDistribution = (
    dailyBreakdown: DailyDriverPerformance[]
): DelayDistributionData[] => {
    const delays: number[] = [];

    dailyBreakdown.forEach((day) => {
        if (day.lateStops > 0) {
            // Estimate individual delays (simplified)
            for (let i = 0; i < day.lateStops; i++) {
                delays.push(day.avgDelayMinutes);
            }
        }
    });

    if (delays.length === 0) {
        return [
            { range: '0-5 min', count: 0 },
            { range: '5-10 min', count: 0 },
            { range: '10-15 min', count: 0 },
            { range: '> 15 min', count: 0 },
        ];
    }

    const buckets = {
        '0-5 min': 0,
        '5-10 min': 0,
        '10-15 min': 0,
        '> 15 min': 0,
    };

    delays.forEach((delay) => {
        if (delay < 5) buckets['0-5 min']++;
        else if (delay < 10) buckets['5-10 min']++;
        else if (delay < 15) buckets['10-15 min']++;
        else buckets['> 15 min']++;
    });

    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
};