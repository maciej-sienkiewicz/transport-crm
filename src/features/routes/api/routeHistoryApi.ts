import { apiClient } from '@/shared/api/client';
import { PageableResponse } from '@/shared/types/api';
import { RouteHistoryItem, UpcomingRouteItem } from '../types';

interface RouteHistoryParams {
    scheduleId: string;
    page?: number;
    size?: number;
    sort?: string;
}

interface UpcomingRoutesParams {
    scheduleId: string;
    page?: number;
    size?: number;
    sort?: string;
}

export const routeHistoryApi = {
    getHistory: async (params: RouteHistoryParams): Promise<PageableResponse<RouteHistoryItem>> => {
        const response = await apiClient.get<PageableResponse<RouteHistoryItem>>('/routes/history', {
            params: {
                scheduleId: params.scheduleId,
                page: params.page || 0,
                size: params.size || 5,
                sort: params.sort || 'date,desc',
            },
        });
        return response.data;
    },

    getUpcoming: async (params: UpcomingRoutesParams): Promise<PageableResponse<UpcomingRouteItem>> => {
        const response = await apiClient.get<PageableResponse<UpcomingRouteItem>>('/routes/upcoming', {
            params: {
                scheduleId: params.scheduleId,
                page: params.page || 0,
                size: params.size || 5,
                sort: params.sort || 'date,asc',
            },
        });
        return response.data;
    },
};