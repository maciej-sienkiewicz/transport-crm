// src/features/dashboard/api/dashboardApi.ts

import { apiClient } from '@/shared/api/client';
import {
    GetDashboardSummaryParams,
    GetAlertsParams,
    DashboardSummaryResponse,
    AlertsResponse,
    TrendsResponse,
} from './types';

export const dashboardApi = {
    /**
     * Pobiera podsumowanie gotowości operacyjnej na dany dzień
     */
    getSummary: async (params: GetDashboardSummaryParams): Promise<DashboardSummaryResponse> => {
        const response = await apiClient.get<DashboardSummaryResponse>('/dashboard/summary', {
            params: {
                date: params.date,
            },
        });
        return response.data;
    },

    /**
     * Pobiera szczegółowe alerty dla wybranego zakresu czasowego
     */
    getAlerts: async (params: GetAlertsParams): Promise<AlertsResponse> => {
        const response = await apiClient.get<AlertsResponse>('/dashboard/alerts', {
            params: {
                scope: params.scope,
            },
        });
        return response.data;
    },

    /**
     * Pobiera trendy tygodniowe (porównanie bieżący vs poprzedni tydzień)
     */
    getTrends: async (): Promise<TrendsResponse> => {
        const response = await apiClient.get<TrendsResponse>('/dashboard/trends');
        return response.data;
    },
};