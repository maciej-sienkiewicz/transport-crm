// src/features/statistics/hooks/useStatistics.ts

import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../api/statisticsApi';
import { DateRange } from '../api/types';

const STALE_TIME = 60 * 60 * 1000; // 1 hour (data is D-1, won't change frequently)
const CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours

// ============================================
// FLEET TRENDS
// ============================================

export const useFleetTrends = (dateRange: DateRange) => {
    return useQuery({
        queryKey: ['statistics', 'fleet', dateRange.startDate, dateRange.endDate],
        queryFn: () => statisticsApi.getFleetTrends(dateRange),
        staleTime: STALE_TIME,
        gcTime: CACHE_TIME,
    });
};

// ============================================
// CAPACITY TRENDS
// ============================================

export const useCapacityTrends = (dateRange: DateRange) => {
    return useQuery({
        queryKey: ['statistics', 'capacity', dateRange.startDate, dateRange.endDate],
        queryFn: () => statisticsApi.getCapacityTrends(dateRange),
        staleTime: STALE_TIME,
        gcTime: CACHE_TIME,
    });
};

// ============================================
// WORKLOAD TRENDS
// ============================================

export const useWorkloadTrends = (dateRange: DateRange) => {
    return useQuery({
        queryKey: ['statistics', 'workload', dateRange.startDate, dateRange.endDate],
        queryFn: () => statisticsApi.getWorkloadTrends(dateRange),
        staleTime: STALE_TIME,
        gcTime: CACHE_TIME,
    });
};

// ============================================
// PASSENGER TRENDS
// ============================================

export const usePassengerTrends = (dateRange: DateRange) => {
    return useQuery({
        queryKey: ['statistics', 'passenger', dateRange.startDate, dateRange.endDate],
        queryFn: () => statisticsApi.getPassengerTrends(dateRange),
        staleTime: STALE_TIME,
        gcTime: CACHE_TIME,
    });
};

// ============================================
// DRIVER PERFORMANCE
// ============================================

export const useDriverRanking = (dateRange: DateRange) => {
    return useQuery({
        queryKey: ['statistics', 'drivers', 'ranking', dateRange.startDate, dateRange.endDate],
        queryFn: () => statisticsApi.getDriverRanking(dateRange),
        staleTime: STALE_TIME,
        gcTime: CACHE_TIME,
    });
};

export const useDriverPerformance = (driverId: string, dateRange: DateRange) => {
    return useQuery({
        queryKey: [
            'statistics',
            'driver',
            driverId,
            dateRange.startDate,
            dateRange.endDate,
        ],
        queryFn: () => statisticsApi.getDriverPerformance(driverId, dateRange),
        enabled: Boolean(driverId),
        staleTime: STALE_TIME,
        gcTime: CACHE_TIME,
    });
};