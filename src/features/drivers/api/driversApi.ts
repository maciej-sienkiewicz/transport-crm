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

    // CEPIK
    getCEPIKHistory: async (driverId: string): Promise<CEPIKCheck[]> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get<CEPIKCheck[]>(`/drivers/${driverId}/cepik-history`);
        // return response.data;

        // MOCK DATA
        return Promise.resolve([
            {
                id: '1',
                timestamp: new Date().toISOString(),
                status: 'ACTIVE',
                checkedBy: 'System',
            },
            {
                id: '2',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                status: 'ACTIVE',
                checkedBy: 'System',
            },
            {
                id: '3',
                timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
                status: 'ACTIVE',
                checkedBy: 'System',
            },
        ]);
    },

    // Documents
    getDocuments: async (driverId: string): Promise<DriverDocument[]> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get<DriverDocument[]>(`/drivers/${driverId}/documents`);
        // return response.data;

        // MOCK DATA
        return Promise.resolve([
            {
                id: '1',
                name: 'Umowa o pracę.pdf',
                type: 'CONTRACT',
                fileUrl: '/documents/contract.pdf',
                fileSize: 2400000,
                uploadedAt: '2024-01-15T10:00:00Z',
                uploadedBy: 'Anna Kowalska',
            },
            {
                id: '2',
                name: 'Aneks nr 1.pdf',
                type: 'AMENDMENT',
                fileUrl: '/documents/amendment1.pdf',
                fileSize: 1100000,
                uploadedAt: '2024-05-03T14:30:00Z',
                uploadedBy: 'Anna Kowalska',
            },
            {
                id: '3',
                name: 'Skan prawa jazdy.pdf',
                type: 'LICENSE_SCAN',
                fileUrl: '/documents/license.pdf',
                fileSize: 850000,
                uploadedAt: '2024-03-12T09:15:00Z',
                uploadedBy: 'Piotr Nowak',
            },
        ]);
    },

    uploadDocument: async (driverId: string, file: File, type: DriverDocument['type']): Promise<DriverDocument> => {
        // TODO: Implement when API is ready
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        // const response = await apiClient.post<DriverDocument>(`/drivers/${driverId}/documents`, formData);
        // return response.data;

        // MOCK
        return Promise.resolve({
            id: Date.now().toString(),
            name: file.name,
            type,
            fileUrl: '/documents/' + file.name,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Current User',
        });
    },

    deleteDocument: async (driverId: string, documentId: string): Promise<void> => {
        // TODO: Implement when API is ready
        // await apiClient.delete(`/drivers/${driverId}/documents/${documentId}`);
        return Promise.resolve();
    },

    // Notes
    getNotes: async (driverId: string): Promise<DriverNote[]> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get<DriverNote[]>(`/drivers/${driverId}/notes`);
        // return response.data;

        // MOCK DATA
        return Promise.resolve([
            {
                id: '1',
                category: 'REMINDER',
                content: 'Kierowca zgłosił, że potrzebuje nowego wycieraczki w autobusie BUS-042. Zlecono serwis na jutro.',
                createdAt: '2025-01-12T14:30:00Z',
                createdBy: {
                    id: '1',
                    name: 'Anna Kowalska',
                    role: 'Dyspozytorka',
                },
            },
            {
                id: '2',
                category: 'PRAISE',
                content: 'Bardzo dobra współpraca z rodzicami. Kilka pozytywnych opinii w tym tygodniu.',
                createdAt: '2025-01-08T09:15:00Z',
                createdBy: {
                    id: '2',
                    name: 'Piotr Nowak',
                    role: 'Kierownik',
                },
            },
        ]);
    },

    createNote: async (driverId: string, data: { category: DriverNote['category']; content: string }): Promise<DriverNote> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.post<DriverNote>(`/drivers/${driverId}/notes`, data);
        // return response.data;

        // MOCK
        return Promise.resolve({
            id: Date.now().toString(),
            category: data.category,
            content: data.content,
            createdAt: new Date().toISOString(),
            createdBy: {
                id: 'current',
                name: 'Current User',
                role: 'Administrator',
            },
        });
    },

    updateNote: async (driverId: string, noteId: string, data: { category: DriverNote['category']; content: string }): Promise<DriverNote> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.put<DriverNote>(`/drivers/${driverId}/notes/${noteId}`, data);
        // return response.data;

        // MOCK
        return Promise.resolve({
            id: noteId,
            category: data.category,
            content: data.content,
            createdAt: new Date().toISOString(),
            createdBy: {
                id: 'current',
                name: 'Current User',
                role: 'Administrator',
            },
        });
    },

    deleteNote: async (driverId: string, noteId: string): Promise<void> => {
        // TODO: Implement when API is ready
        // await apiClient.delete(`/drivers/${driverId}/notes/${noteId}`);
        return Promise.resolve();
    },

    // Planned Routes
    getPlannedRoutes: async (driverId: string, date?: string): Promise<PlannedRoute[]> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get<PlannedRoute[]>(`/drivers/${driverId}/routes/planned`, {
        //     params: { date }
        // });
        // return response.data;

        // MOCK DATA
        const now = new Date();
        const in45Min = new Date(now.getTime() + 45 * 60000);
        const in3Hours = new Date(now.getTime() + 3 * 3600000);

        return Promise.resolve([
            {
                id: 'RT-2847',
                routeNumber: 'RT-2847',
                startTime: in45Min.toISOString(),
                startLocation: 'Centrum',
                endLocation: 'Szkoła Podstawowa nr 5',
                childrenCount: 12,
                vehicleId: 'BUS-042',
                vehicleName: 'Mercedes Sprinter',
                stopsCount: 8,
                estimatedDuration: 45,
                status: 'PLANNED',
            },
            {
                id: 'RT-2848',
                routeNumber: 'RT-2848',
                startTime: in3Hours.toISOString(),
                startLocation: 'Szkoła Podstawowa nr 5',
                endLocation: 'Dom',
                childrenCount: 10,
                vehicleId: 'BUS-042',
                vehicleName: 'Mercedes Sprinter',
                stopsCount: 7,
                estimatedDuration: 40,
                status: 'PLANNED',
            },
        ]);
    },

    // Route History
    getRouteHistory: async (
        driverId: string,
        params: { page: number; size: number; startDate?: string; endDate?: string }
    ): Promise<PageableResponse<RouteHistoryItem>> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get<PageableResponse<RouteHistoryItem>>(
        //     `/drivers/${driverId}/routes/history`,
        //     { params }
        // );
        // return response.data;

        // MOCK DATA
        const mockRoutes: RouteHistoryItem[] = Array.from({ length: 15 }, (_, i) => ({
            id: `RH-${i + 1}`,
            routeNumber: `RT-${2800 + i}`,
            date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
            startTime: '14:00',
            endTime: '15:30',
            route: i % 2 === 0 ? 'Centrum → Szkoła 5' : 'Szkoła 5 → Dom',
            status: i % 10 === 0 ? 'COMPLETED_WITH_DELAY' : 'COMPLETED',
            punctuality: i % 10 !== 0,
            delay: i % 10 === 0 ? 12 : undefined,
            childrenCount: 10 + (i % 5),
            distance: 15 + (i % 10),
            notes: i % 5 === 0 ? 'Niewielkie opóźnienie przez korek' : undefined,
        }));

        return Promise.resolve({
            content: mockRoutes.slice(0, params.size),
            totalElements: mockRoutes.length,
            totalPages: Math.ceil(mockRoutes.length / params.size),
            number: params.page,
            size: params.size,
        });
    },

    getRouteHistorySummary: async (driverId: string, days: number = 30): Promise<RouteHistorySummary> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get<RouteHistorySummary>(`/drivers/${driverId}/routes/summary`, {
        //     params: { days }
        // });
        // return response.data;

        // MOCK DATA
        return Promise.resolve({
            totalRoutes: 245,
            totalHours: 189.5,
            totalKm: 3450,
            averageRating: 4.8,
            punctualityRate: 96.7,
            punctualRoutes: 237,
        });
    },

    // Reports
    downloadReport: async (driverId: string, format: 'pdf' | 'csv' | 'excel', period: string): Promise<Blob> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get(`/drivers/${driverId}/reports/${format}`, {
        //     params: { period },
        //     responseType: 'blob',
        // });
        // return response.data;

        // MOCK - return fake blob
        return Promise.resolve(new Blob(['Mock report data'], { type: 'application/pdf' }));
    },

    getAbsences: async (driverId: string): Promise<DriverAbsencesResponse> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get<DriverAbsencesResponse>(`/drivers/${driverId}/absences`);
        // return response.data;

        // MOCK DATA
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        return Promise.resolve({
            absences: [
                {
                    id: '1',
                    driverId,
                    type: 'VACATION',
                    status: 'PLANNED',
                    startDate: nextWeek.toISOString().split('T')[0],
                    endDate: new Date(nextWeek.getTime() + 7 * 86400000).toISOString().split('T')[0],
                    reason: 'Urlop wypoczynkowy - zaplanowany wcześniej',
                    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
                    createdBy: {
                        id: 'user1',
                        name: 'Anna Kowalska',
                    },
                },
                {
                    id: '2',
                    driverId,
                    type: 'SICK_LEAVE',
                    status: 'COMPLETED',
                    startDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
                    endDate: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
                    reason: 'Zwolnienie lekarskie L4',
                    createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
                    createdBy: {
                        id: 'user1',
                        name: 'Anna Kowalska',
                    },
                },
            ],
            totalCount: 2,
        });
    },

    createAbsence: async (driverId: string, data: CreateDriverAbsenceRequest): Promise<DriverAbsence> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.post<DriverAbsence>(`/drivers/${driverId}/absences`, data);
        // return response.data;

        // MOCK
        return Promise.resolve({
            id: Date.now().toString(),
            driverId,
            type: data.type,
            status: 'PLANNED',
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
            createdAt: new Date().toISOString(),
            createdBy: {
                id: 'current',
                name: 'Current User',
            },
        });
    },

    cancelAbsence: async (driverId: string, absenceId: string, data: CancelDriverAbsenceRequest): Promise<void> => {
        // TODO: Implement when API is ready
        // await apiClient.post(`/drivers/${driverId}/absences/${absenceId}/cancel`, data);
        return Promise.resolve();
    },
};