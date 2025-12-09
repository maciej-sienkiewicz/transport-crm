// src/features/statistics/api/types.ts

export interface DateRange {
    startDate: string; // ISO 8601 format: YYYY-MM-DD
    endDate: string;   // ISO 8601 format: YYYY-MM-DD
}

// ============================================
// FLEET TRENDS
// ============================================

export interface FleetMetric {
    metricDate: string;
    totalVehicles: number;
    vehiclesInRoutes: number;
    vehiclesAvailable: number;
    totalDrivers: number;
    driversInRoutes: number;
    driversAvailable: number;
    routesWithoutDriver: number;
}

export interface FleetTrendsResponse {
    startDate: string;
    endDate: string;
    metrics: FleetMetric[];
}

// ============================================
// CAPACITY TRENDS
// ============================================

export interface CapacityMetric {
    metricDate: string;
    avgSaturationPercent: number;
    minSaturationPercent: number;
    maxSaturationPercent: number;
    totalRoutes: number;
    routesLowSaturation: number; // < 70%
}

export interface CapacityTrendsResponse {
    startDate: string;
    endDate: string;
    metrics: CapacityMetric[];
}

// ============================================
// WORKLOAD TRENDS
// ============================================

export interface WorkloadMetric {
    metricDate: string;
    avgStopsPerVehicle: number;
    minStopsPerVehicle: number;
    maxStopsPerVehicle: number;
    stdDevStops: number;
    avgStopsPerDriver: number;
    minStopsPerDriver: number;
    maxStopsPerDriver: number;
}

export interface WorkloadTrendsResponse {
    startDate: string;
    endDate: string;
    metrics: WorkloadMetric[];
}

// ============================================
// PASSENGER TRIP DURATION TRENDS
// ============================================

export interface PassengerMetric {
    metricDate: string;
    avgTripDurationMinutes: number;
    p50TripDurationMinutes: number;
    p90TripDurationMinutes: number;
    p99TripDurationMinutes: number;
    totalTrips: number;
    tripsOverP90Count: number;
}

export interface PassengerTrendsResponse {
    startDate: string;
    endDate: string;
    metrics: PassengerMetric[];
}

// ============================================
// DRIVER PERFORMANCE
// ============================================

export interface DailyDriverPerformance {
    driverId: string;
    metricDate: string;
    totalStops: number;
    ontimeStops: number;
    lateStops: number;
    otdPercentage: number;
    avgDelayMinutes: number;
    maxDelayMinutes: number;
}

export interface DriverPerformanceSummary {
    driverId: string;
    driverName: string;
    period: string;
    totalStops: number;
    ontimeStops: number;
    lateStops: number;
    otdPercentage: number;
    avgDelayMinutes: number;
    maxDelayMinutes: number;
    dailyBreakdown: DailyDriverPerformance[];
}

export interface DriverRankingResponse {
    startDate: string;
    endDate: string;
    drivers: DriverPerformanceSummary[];
}

export interface DriverPerformanceDetailResponse extends DriverPerformanceSummary {}

// ============================================
// CALCULATED METRICS (client-side)
// ============================================

export interface TrendIndicator {
    value: number;
    change: number; // percentage change vs previous period
    direction: 'up' | 'down' | 'stable';
}

export interface StatsSummary {
    fleet: {
        avgUtilization: number;
        avgIdleVehicles: number;
        avgRoutesWithoutDriver: number;
    };
    drivers: {
        avgOTD: number;
        excellentDrivers: number; // ≥95%
        poorDrivers: number; // <85%
    };
    capacity: {
        avgSaturation: number;
        lowSaturationRoutes: number;
    };
    serviceQuality: {
        avgTripDuration: number;
        p90TripDuration: number;
    };
}