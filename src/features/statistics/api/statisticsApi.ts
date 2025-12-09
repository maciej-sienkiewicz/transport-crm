// src/features/statistics/api/statisticsApi.ts

import { apiClient } from '@/shared/api/client';
import {
    DateRange,
    FleetTrendsResponse,
    CapacityTrendsResponse,
    WorkloadTrendsResponse,
    PassengerTrendsResponse,
    DriverRankingResponse,
    DriverPerformanceDetailResponse,
} from './types';

export const statisticsApi = {
    // ============================================
    // FLEET METRICS
    // ============================================

    getFleetTrends: async (dateRange: DateRange): Promise<FleetTrendsResponse> => {
        const response = await apiClient.get<FleetTrendsResponse>(
            '/statistics/trends/fleet',
            {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                },
            }
        );
        return response.data;
    },

    // ============================================
    // CAPACITY METRICS
    // ============================================

    getCapacityTrends: async (dateRange: DateRange): Promise<CapacityTrendsResponse> => {
        const response = await apiClient.get<CapacityTrendsResponse>(
            '/statistics/trends/capacity',
            {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                },
            }
        );
        return response.data;
    },

    // ============================================
    // WORKLOAD METRICS
    // ============================================

    getWorkloadTrends: async (dateRange: DateRange): Promise<WorkloadTrendsResponse> => {
        const response = await apiClient.get<WorkloadTrendsResponse>(
            '/statistics/trends/workload',
            {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                },
            }
        );
        return response.data;
    },

    // ============================================
    // PASSENGER TRIP DURATION METRICS
    // ============================================

    getPassengerTrends: async (dateRange: DateRange): Promise<PassengerTrendsResponse> => {
        const response = await apiClient.get<PassengerTrendsResponse>(
            '/statistics/trends/passenger',
            {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                },
            }
        );
        return response.data;
    },

    // ============================================
    // DRIVER PERFORMANCE
    // ============================================

    getDriverRanking: async (dateRange: DateRange): Promise<DriverRankingResponse> => {
        const response = await apiClient.get<DriverRankingResponse>(
            '/statistics/drivers/performance/ranking',
            {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                },
            }
        );
        return response.data;
    },

    getDriverPerformance: async (
        driverId: string,
        dateRange: DateRange
    ): Promise<DriverPerformanceDetailResponse> => {
        const response = await apiClient.get<DriverPerformanceDetailResponse>(
            `/statistics/drivers/${driverId}/performance`,
            {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                },
            }
        );
        return response.data;
    },
};