// src/features/routes/api/routeScheduleApi.ts

import { apiClient } from '@/shared/api/client';

export interface AddScheduleToRouteRequest {
    childId: string;
    scheduleId: string;
    pickupStop: {
        stopOrder: number;
        estimatedTime: string;
        address: {
            label?: string;
            street: string;
            houseNumber: string;
            apartmentNumber?: string;
            postalCode: string;
            city: string;
        };
    };
    dropoffStop: {
        stopOrder: number;
        estimatedTime: string;
        address: {
            label?: string;
            street: string;
            houseNumber: string;
            apartmentNumber?: string;
            postalCode: string;
            city: string;
        };
    };
}

export interface AddScheduleToRouteResponse {
    pickupStopId: string;
    dropoffStopId: string;
    scheduleId: string;
    childId: string;
}

export interface UpdateStopRequest {
    estimatedTime: string;
    address: {
        label?: string;
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
}

export interface UpdateStopResponse {
    stopId: string;
    estimatedTime: string;
    address: {
        label: string;
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
}

export const routeScheduleApi = {
    addScheduleToRoute: async (
        routeId: string,
        data: AddScheduleToRouteRequest
    ): Promise<AddScheduleToRouteResponse> => {
        const response = await apiClient.post<AddScheduleToRouteResponse>(
            `/routes/${routeId}/schedules`,
            data
        );
        return response.data;
    },

    deleteScheduleFromRoute: async (
        routeId: string,
        scheduleId: string
    ): Promise<void> => {
        await apiClient.delete(`/routes/${routeId}/schedules/${scheduleId}`);
    },

    updateStop: async (
        routeId: string,
        stopId: string,
        data: UpdateStopRequest
    ): Promise<UpdateStopResponse> => {
        const response = await apiClient.patch<UpdateStopResponse>(
            `/routes/${routeId}/stops/${stopId}`,
            data
        );
        return response.data;
    },
};