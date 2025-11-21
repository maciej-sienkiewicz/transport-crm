// src/features/routes/api/routeSeriesApi.ts

import { apiClient } from '@/shared/api/client';
import { PaginationParams, PageableResponse } from '@/shared/types/api';
import {
    RouteSeriesListItem,
    RouteSeriesDetail,
    CreateRouteSeriesRequest,
    CreateRouteSeriesResponse,
    AddScheduleToSeriesRequest,
    AddScheduleToSeriesResponse,
    RemoveScheduleFromSeriesRequest,
    RemoveScheduleFromSeriesResponse,
    CancelRouteSeriesRequest,
    CancelRouteSeriesResponse,
    RouteSeriesStatus,
} from '../types';

interface GetRouteSeriesParams extends PaginationParams {
    status?: RouteSeriesStatus;
}

export const routeSeriesApi = {
    // GET /api/route-series
    getAll: async (params: GetRouteSeriesParams): Promise<PageableResponse<RouteSeriesListItem>> => {
        const response = await apiClient.get<PageableResponse<RouteSeriesListItem>>('/route-series', {
            params: {
                page: params.page || 0,
                size: params.size || 20,
                sort: params.sort || 'createdAt,desc',
                status: params.status,
            },
        });
        return response.data;
    },

    // GET /api/route-series/{seriesId}
    getById: async (seriesId: string): Promise<RouteSeriesDetail> => {
        const response = await apiClient.get<RouteSeriesDetail>(`/route-series/${seriesId}`);
        return response.data;
    },

    // POST /api/route-series/from-route/{routeId}
    createFromRoute: async (
        routeId: string,
        data: CreateRouteSeriesRequest
    ): Promise<CreateRouteSeriesResponse> => {
        const response = await apiClient.post<CreateRouteSeriesResponse>(
            `/route-series/from-route/${routeId}`,
            data
        );
        return response.data;
    },

    // POST /api/route-series/{seriesId}/schedules
    addSchedule: async (
        seriesId: string,
        data: AddScheduleToSeriesRequest
    ): Promise<AddScheduleToSeriesResponse> => {
        const response = await apiClient.post<AddScheduleToSeriesResponse>(
            `/route-series/${seriesId}/schedules`,
            data
        );
        return response.data;
    },

    // DELETE /api/route-series/{seriesId}/schedules/{scheduleId}
    removeSchedule: async (
        seriesId: string,
        scheduleId: string,
        data: RemoveScheduleFromSeriesRequest
    ): Promise<RemoveScheduleFromSeriesResponse> => {
        const response = await apiClient.delete<RemoveScheduleFromSeriesResponse>(
            `/route-series/${seriesId}/schedules/${scheduleId}`,
            { data }
        );
        return response.data;
    },

    // POST /api/route-series/{seriesId}/cancel
    cancel: async (
        seriesId: string,
        data: CancelRouteSeriesRequest
    ): Promise<CancelRouteSeriesResponse> => {
        const response = await apiClient.post<CancelRouteSeriesResponse>(
            `/route-series/${seriesId}/cancel`,
            data
        );
        return response.data;
    },
};