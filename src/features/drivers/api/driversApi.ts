// src/features/drivers/api/driversApi.ts
import { apiClient } from '@/shared/api/client';
import { PaginationParams, PageableResponse } from '@/shared/types/api';
import {
    Driver,
    DriverListItem,
    CreateDriverRequest,
    UpdateDriverRequest,
    DriverStatus,
} from '../types';

interface GetDriversParams extends PaginationParams {
    status?: DriverStatus;
    search?: string;
}

export const driversApi = {
    getAll: async (params: GetDriversParams): Promise<PageableResponse<DriverListItem>> => {
        const response = await apiClient.get<PageableResponse<DriverListItem>>('/drivers', {
            params: {
                page: params.page || 0,
                size: params.size || 20,
                sort: params.sort || 'lastName,asc',
                status: params.status,
                search: params.search,
            },
        });
        return response.data;
    },

    getById: async (id: string): Promise<Driver> => {
        const response = await apiClient.get<Driver>(`/drivers/${id}`);
        return response.data;
    },

    create: async (data: CreateDriverRequest): Promise<Driver> => {
        const response = await apiClient.post<Driver>('/drivers', data);
        return response.data;
    },

    update: async (id: string, data: UpdateDriverRequest): Promise<Driver> => {
        const response = await apiClient.put<Driver>(`/drivers/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/drivers/${id}`);
    },
};