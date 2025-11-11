// src/shared/api/absencesApi.ts
import { apiClient } from './client';
import {
    Absence,
    CreateAbsenceRequest,
    CancelAbsenceRequest,
    CancelAbsenceResponse,
    AbsenceStats,
    AbsenceFilters,
} from '../types/absence';

export const absencesApi = {
    // Create absence
    createAbsence: async (
        childId: string,
        data: CreateAbsenceRequest
    ): Promise<Absence> => {
        const response = await apiClient.post<Absence>(
            `/children/${childId}/absences`,
            data
        );
        return response.data;
    },

    // List absences by child
    getChildAbsences: async (
        childId: string,
        filters: AbsenceFilters = {}
    ): Promise<{ absences: Absence[] }> => {
        const response = await apiClient.get<{ absences: Absence[] }>(
            `/children/${childId}/absences`,
            {
                params: {
                    from: filters.from,
                    to: filters.to,
                    statuses: filters.statuses?.join(','),
                },
            }
        );
        return response.data;
    },

    // List absences by schedule
    getScheduleAbsences: async (
        scheduleId: string,
        filters: Omit<AbsenceFilters, 'statuses'> = {}
    ): Promise<{ absences: Absence[] }> => {
        const response = await apiClient.get<{ absences: Absence[] }>(
            `/schedules/${scheduleId}/absences`,
            {
                params: {
                    from: filters.from,
                    to: filters.to,
                },
            }
        );
        return response.data;
    },

    // Get absence by ID
    getAbsenceById: async (id: string): Promise<Absence> => {
        const response = await apiClient.get<Absence>(`/absences/${id}`);
        return response.data;
    },

    // Cancel absence
    cancelAbsence: async (
        id: string,
        data: CancelAbsenceRequest
    ): Promise<CancelAbsenceResponse> => {
        const response = await apiClient.post<CancelAbsenceResponse>(
            `/absences/${id}/cancel`,
            data
        );
        return response.data;
    },

    // Get absence statistics
    getAbsenceStats: async (
        childId: string,
        year?: number,
        month?: number
    ): Promise<AbsenceStats> => {
        const response = await apiClient.get<AbsenceStats>(
            `/children/${childId}/absence-stats`,
            {
                params: {
                    year,
                    month,
                },
            }
        );
        return response.data;
    },
};