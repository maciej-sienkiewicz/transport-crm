// src/features/drivers/api/driversApi.ts - ROZSZERZENIE
import { apiClient } from '@/shared/api/client';
import { PaginationParams, PageableResponse } from '@/shared/types/api';
import {
    Driver,
    DriverDetail,
    DriverListItem,
    CreateDriverRequest,
    UpdateDriverRequest,
    DriverStatus,
    CEPIKCheck,
    DriverDocument,
    DriverNote,
    PlannedRoute,
    RouteHistoryItem,
    RouteHistorySummary, CancelDriverAbsenceRequest, CreateDriverAbsenceRequest, DriverAbsence, DriverAbsencesResponse,
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

// src/features/drivers/api/driversApi.ts - zaktualizuj metodę getById
    getById: async (id: string): Promise<DriverDetail> => {
        // Temporary: get basic driver data
        const response = await apiClient.get<Driver>(`/drivers/${id}`);
        const driver = response.data;

        // TODO: Remove mock data when API is ready - add to DriverDetail
        const driverDetail: DriverDetail = {
            ...driver,
            stats: {
                today: {
                    completedRoutes: 8,
                    totalRoutes: 12,
                    hoursWorked: 6.5,
                    totalHours: 12,
                    kmDriven: 142,
                    currentVehicle: 'BUS-042',
                },
                week: {
                    totalRoutes: 45,
                    absences: 0,
                    delays: 2,
                    delayPercentage: 4.4,
                },
            },
            nextRoute: undefined, // Will be populated by usePlannedRoutes
            latestCEPIKCheck: {
                id: 'cepik-1',
                timestamp: new Date().toISOString(),
                status: 'ACTIVE',
                checkedBy: 'System',
            },
        };

        return driverDetail;
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

    // Notes
    getNotes: async (driverId: string): Promise<DriverNote[]> => {
        // TODO: Implement when API is ready
        const response = await apiClient.get<DriverNote[]>(`/drivers/${driverId}/notes`);
        return response.data.notes;
    },

    createNote: async (driverId: string, data: { category: DriverNote['category']; content: string }): Promise<DriverNote> => {
        const response = await apiClient.post<DriverNote>(`/drivers/${driverId}/notes`, data);
        return response.data;
    },

    updateNote: async (driverId: string, noteId: string, data: { category: DriverNote['category']; content: string }): Promise<DriverNote> => {
        const response = await apiClient.put<DriverNote>(`/drivers/${driverId}/notes/${noteId}`, data);
        return response.data;
    },

    deleteNote: async (driverId: string, noteId: string): Promise<void> => {
        await apiClient.delete(`/drivers/${driverId}/notes/${noteId}`);
    },

    // Planned Routes
    getPlannedRoutes: async (driverId: string, date?: string): Promise<PlannedRoute[]> => {
        const response = await apiClient.get<PageableResponse<PlannedRoute>>(
            `/drivers/${driverId}/routes/upcoming`,
            { params: { date, size: 100 } }
        );
        return response.data.content;
    },

    // Route History
    getRouteHistory: async (
        driverId: string,
        params: { page: number; size: number; startDate?: string; endDate?: string }
    ): Promise<PageableResponse<RouteHistoryItem>> => {
        const response = await apiClient.get<PageableResponse<RouteHistoryItem>>(
            `/drivers/${driverId}/routes/history`,
            { params }
        );
        return response.data;
    },


    getAbsences: async (driverId: string): Promise<DriverAbsence[]> => {
        const response = await apiClient.get<DriverAbsencesResponse>(`/drivers/${driverId}/absences`);
        return response.data.absences;
    },

    createAbsence: async (driverId: string, data: CreateDriverAbsenceRequest): Promise<DriverAbsence> => {
        const response = await apiClient.post<DriverAbsence>(`/drivers/${driverId}/absences`, data);
        return response.data;
    },

    cancelAbsence: async (driverId: string, absenceId: string, data: CancelDriverAbsenceRequest): Promise<void> => {
        await apiClient.post(`/drivers/${driverId}/absences/${absenceId}/cancel`, data);
    },
};