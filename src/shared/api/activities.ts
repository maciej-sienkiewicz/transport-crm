// src/shared/api/activitiesApi.ts
import { apiClient } from './client';
import { PageableResponse } from '../types/api';
import { Activity, ActivityFilters } from '../types/activity';

export const activitiesApi = {
    getChildActivities: async (
        childId: string,
        filters: ActivityFilters = {}
    ): Promise<PageableResponse<Activity>> => {
        const response = await apiClient.get<PageableResponse<Activity>>(
            `/children/${childId}/activities`,
            {
                params: {
                    category: filters.category,
                    page: filters.page || 0,
                    size: filters.size || 20,
                },
            }
        );
        return response.data;
    },

    getGuardianActivities: async (
        guardianId: string,
        filters: ActivityFilters = {}
    ): Promise<PageableResponse<Activity>> => {
        const response = await apiClient.get<PageableResponse<Activity>>(
            `/guardians/${guardianId}/activities`,
            {
                params: {
                    category: filters.category,
                    page: filters.page || 0,
                    size: filters.size || 20,
                },
            }
        );
        return response.data;
    },

    getRouteActivities: async (
        routeId: string,
        filters: ActivityFilters = {}
    ): Promise<PageableResponse<Activity>> => {
        const response = await apiClient.get<PageableResponse<Activity>>(
            `/routes/${routeId}/activities`,
            {
                params: {
                    category: filters.category,
                    page: filters.page || 0,
                    size: filters.size || 20,
                },
            }
        );
        return response.data;
    },

    getDriverActivities: async (
        driverId: string,
        filters: ActivityFilters = {}
    ): Promise<PageableResponse<Activity>> => {
        const response = await apiClient.get<PageableResponse<Activity>>(
            `/drivers/${driverId}/activities`,
            {
                params: {
                    category: filters.category,
                    page: filters.page || 0,
                    size: filters.size || 20,
                },
            }
        );
        return response.data;
    },

    getScheduleActivities: async (
        scheduleId: string,
        filters: ActivityFilters = {}
    ): Promise<PageableResponse<Activity>> => {
        const response = await apiClient.get<PageableResponse<Activity>>(
            `/schedules/${scheduleId}/activities`,
            {
                params: {
                    category: filters.category,
                    page: filters.page || 0,
                    size: filters.size || 20,
                },
            }
        );
        return response.data;
    },

    getVehicleActivities: async (
        vehicleId: string,
        filters: ActivityFilters = {}
    ): Promise<PageableResponse<Activity>> => {
        const response = await apiClient.get<PageableResponse<Activity>>(
            `/vehicles/${vehicleId}/activities`,
            {
                params: {
                    category: filters.category,
                    page: filters.page || 0,
                    size: filters.size || 20,
                },
            }
        );
        return response.data;
    },
};