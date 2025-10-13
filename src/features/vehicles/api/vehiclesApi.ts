// src/features/vehicles/api/vehiclesApi.ts
import { apiClient } from '@/shared/api/client';
import { PaginationParams, PageableResponse } from '@/shared/types/api';
import {
    Vehicle,
    VehicleListItem,
    CreateVehicleRequest,
    UpdateVehicleRequest,
    VehicleStatus,
    VehicleType,
} from '../types';

interface GetVehiclesParams extends PaginationParams {
    status?: VehicleStatus;
    vehicleType?: VehicleType;
}

export const vehiclesApi = {
    getAll: async (params: GetVehiclesParams): Promise<PageableResponse<VehicleListItem>> => {
        const response = await apiClient.get<PageableResponse<VehicleListItem>>('/vehicles', {
            params: {
                page: params.page || 0,
                size: params.size || 20,
                sort: params.sort || 'registrationNumber,asc',
                status: params.status,
                vehicleType: params.vehicleType,
            },
        });
        return response.data;
    },

    getById: async (id: string): Promise<Vehicle> => {
        const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
        return response.data;
    },

    create: async (data: CreateVehicleRequest): Promise<Vehicle> => {
        const response = await apiClient.post<Vehicle>('/vehicles', data);
        return response.data;
    },

    update: async (id: string, data: UpdateVehicleRequest): Promise<Vehicle> => {
        const response = await apiClient.put<Vehicle>(`/vehicles/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/vehicles/${id}`);
    },
};