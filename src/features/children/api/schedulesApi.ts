import { apiClient } from '@/shared/api/client';
import {
    ChildSchedule,
    CreateScheduleRequest,
    UpdateScheduleRequest,
} from '../types';

export const schedulesApi = {
    getByChildId: async (childId: string): Promise<{ schedules: ChildSchedule[] }> => {
        const response = await apiClient.get<{ schedules: ChildSchedule[] }>(
            `/children/${childId}/schedules`
        );
        return response.data;
    },

    create: async (
        childId: string,
        data: CreateScheduleRequest
    ): Promise<ChildSchedule> => {
        const response = await apiClient.post<ChildSchedule>(
            `/children/${childId}/schedules`,
            data
        );
        return response.data;
    },

    update: async (
        scheduleId: string,
        data: UpdateScheduleRequest
    ): Promise<ChildSchedule> => {
        const response = await apiClient.put<ChildSchedule>(
            `/schedules/${scheduleId}`,
            data
        );
        return response.data;
    },

    delete: async (scheduleId: string): Promise<void> => {
        await apiClient.delete(`/schedules/${scheduleId}`);
    },
};