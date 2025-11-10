// src/features/routes/api/routesApi.ts

import { apiClient } from '@/shared/api/client';
import { PaginationParams, PageableResponse } from '@/shared/types/api';
import {
    RouteListItem,
    RouteDetail,
    CreateRouteRequest,
    RouteStatus,
    AvailableChild,
} from '../types';

interface GetRoutesParams extends PaginationParams {
    date?: string;
    status?: RouteStatus;
    driverId?: string;
}

interface ReorderStopsResponse {
    routeId: string;
    updatedStopsCount: number;
}

export const routesApi = {
    getAll: async (params: GetRoutesParams): Promise<PageableResponse<RouteListItem>> => {
        const response = await apiClient.get<PageableResponse<RouteListItem>>('/routes', {
            params: {
                page: params.page || 0,
                size: params.size || 20,
                sort: params.sort || 'date,desc',
                date: params.date,
                status: params.status,
                driverId: params.driverId,
            },
        });
        return response.data;
    },

    getById: async (id: string): Promise<RouteDetail> => {
        const response = await apiClient.get<RouteDetail>(`/routes/${id}`);
        return response.data;
    },

    create: async (data: CreateRouteRequest): Promise<RouteDetail> => {
        const response = await apiClient.post<RouteDetail>('/routes', data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/routes/${id}`);
    },

    reorderStops: async (
        routeId: string,
        stopOrders: Array<{ stopId: string; newOrder: number }>
    ): Promise<ReorderStopsResponse> => {
        const response = await apiClient.patch<ReorderStopsResponse>(
            `/routes/${routeId}/stops/reorder`,
            { stopOrders }
        );
        return response.data;
    },

    updateStatus: async (
        id: string,
        status: RouteStatus,
        actualStartTime?: string,
        actualEndTime?: string
    ): Promise<RouteDetail> => {
        const response = await apiClient.patch<RouteDetail>(`/routes/${id}/status`, {
            status,
            actualStartTime,
            actualEndTime,
        });
        return response.data;
    },

    getAvailableChildren: async (date: string): Promise<AvailableChild[]> => {
        const response = await apiClient.get<AvailableChild[]>('/routes/available-children', {
            params: { date },
        });
        return response.data;
    },
};