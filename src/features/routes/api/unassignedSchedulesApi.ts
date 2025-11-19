// src/features/routes/api/unassignedSchedulesApi.ts
import { apiClient } from '@/shared/api/client';
import { UnassignedScheduleItem } from '../types';

export interface UnassignedSchedulesResponse {
    date: string;
    schedules: UnassignedScheduleItem[];
    totalCount: number;
}

export const unassignedSchedulesApi = {
    getUnassigned: async (date: string): Promise<UnassignedSchedulesResponse> => {
        const response = await apiClient.get<UnassignedSchedulesResponse>(
            '/schedules/unassigned',
            { params: { date } }
        );
        return response.data;
    },
};