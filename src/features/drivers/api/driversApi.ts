// src/features/drivers/api/driversApi.ts
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
    DriverNote,
    PlannedRoute,
    RouteHistoryItem,
    CancelDriverAbsenceRequest,
    CreateDriverAbsenceRequest,
    DriverAbsence,
    DriverAbsencesResponse,
    Document,
    DocumentType,
    UploadUrlResponse,
    DocumentUploadResult,
} from '../types';

interface GetDriversParams extends PaginationParams {
    status?: DriverStatus;
    search?: string;
}

export const driversApi = {
    // ============================================
    // DRIVERS CRUD
    // ============================================

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

    getById: async (id: string): Promise<DriverDetail> => {
        const response = await apiClient.get<Driver>(`/drivers/${id}`);
        const driver = response.data;

        // TODO: Remove mock data when API is ready
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
            nextRoute: undefined,
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

    // ============================================
    // NOTES
    // ============================================

    getNotes: async (driverId: string): Promise<DriverNote[]> => {
        interface DriverNoteListResponse {
            notes: DriverNote[];
        }
        const response = await apiClient.get<DriverNoteListResponse>(`/drivers/${driverId}/notes`);
        return response.data.notes;
    },

    createNote: async (
        driverId: string,
        data: { category: DriverNote['category']; content: string }
    ): Promise<DriverNote> => {
        const response = await apiClient.post<DriverNote>(`/drivers/${driverId}/notes`, data);
        return response.data;
    },

    updateNote: async (
        driverId: string,
        noteId: string,
        data: { category: DriverNote['category']; content: string }
    ): Promise<DriverNote> => {
        const response = await apiClient.put<DriverNote>(
            `/drivers/${driverId}/notes/${noteId}`,
            data
        );
        return response.data;
    },

    deleteNote: async (driverId: string, noteId: string): Promise<void> => {
        await apiClient.delete(`/drivers/${driverId}/notes/${noteId}`);
    },

    // ============================================
    // PLANNED ROUTES
    // ============================================

    getPlannedRoutes: async (driverId: string, date?: string): Promise<PlannedRoute[]> => {
        interface BackendPlannedRoute {
            id: string;
            routeName: string;
            date: string;
            status: string;
            vehicleId: string;
            vehicleRegistrationNumber: string;
            estimatedStartTime: string;
            estimatedEndTime: string;
            stopsCount: number;
            childrenCount: number;
            firstStopAddress: string;
            lastStopAddress: string;
        }

        const response = await apiClient.get<PageableResponse<BackendPlannedRoute>>(
            `/drivers/${driverId}/routes/upcoming`,
            {
                params: {
                    date,
                    size: 100,
                    sort: 'date,estimatedStartTime',
                },
            }
        );

        return response.data.content.map((route) => {
            const startDateTime = new Date(`${route.date}T${route.estimatedStartTime}:00`);
            const endDateTime = new Date(`${route.date}T${route.estimatedEndTime}:00`);

            const estimatedDuration = Math.floor(
                (endDateTime.getTime() - startDateTime.getTime()) / 60000
            );

            return {
                id: route.id,
                routeName: route.routeName,
                date: route.date,
                status: route.status as PlannedRoute['status'],
                vehicleId: route.vehicleId,
                vehicleRegistrationNumber: route.vehicleRegistrationNumber,
                estimatedStartTime: route.estimatedStartTime,
                estimatedEndTime: route.estimatedEndTime,
                stopsCount: route.stopsCount,
                childrenCount: route.childrenCount,
                firstStopAddress: route.firstStopAddress,
                lastStopAddress: route.lastStopAddress,
            };
        });
    },

    // ============================================
    // ROUTE HISTORY
    // ============================================

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

    // ============================================
    // ABSENCES
    // ============================================

    getAbsences: async (driverId: string): Promise<DriverAbsence[]> => {
        const response = await apiClient.get<DriverAbsencesResponse>(
            `/drivers/${driverId}/absences`
        );
        return response.data.absences;
    },

    createAbsence: async (
        driverId: string,
        data: CreateDriverAbsenceRequest
    ): Promise<DriverAbsence> => {
        const response = await apiClient.post<DriverAbsence>(
            `/drivers/${driverId}/absences`,
            data
        );
        return response.data;
    },

    cancelAbsence: async (
        driverId: string,
        absenceId: string,
        data: CancelDriverAbsenceRequest
    ): Promise<void> => {
        await apiClient.post(`/drivers/${driverId}/absences/${absenceId}/cancel`, data);
    },

    // ============================================
    // DOCUMENTS - PRESIGNED URL FLOW
    // ============================================

    /**
     * Step 1: Get presigned upload URL from backend
     */
    getDocumentUploadUrl: async (
        driverId: string,
        fileName: string,
        fileSize: number,
        contentType: string,
        documentType: DocumentType,
        notes?: string
    ): Promise<UploadUrlResponse> => {
        const response = await apiClient.post<UploadUrlResponse>(
            `/drivers/${driverId}/documents/upload-url`,
            {
                entityType: 'DRIVER',
                entityId: driverId,
                documentType,
                fileName,
                contentType,
                fileSize,
            }
        );
        return response.data;
    },

    /**
     * Step 2: Upload file directly to S3 using presigned URL
     */
    uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            throw new Error(`S3 upload failed: ${response.statusText}`);
        }
    },

    /**
     * Step 3: Confirm upload and save metadata in database
     */
    confirmDocumentUpload: async (
        driverId: string,
        fileName: string,
        fileSize: number,
        contentType: string,
        s3Key: string,
        documentType: DocumentType,
        notes?: string
    ): Promise<DocumentUploadResult> => {
        const response = await apiClient.post<DocumentUploadResult>(
            `/drivers/${driverId}/documents`,
            {
                // ✅ Nie wysyłamy entityType i entityId - backend je ustawi
                documentType,
                fileName,
                fileSize,
                contentType,
                s3Key,
                notes,
            }
        );
        return response.data;
    },

    /**
     * Get all documents for a driver
     */
    getDocuments: async (driverId: string): Promise<Document[]> => {
        const response = await apiClient.get<{ documents: Document[]; totalCount: number }>(
            `/drivers/${driverId}/documents`
        );
        return response.data.documents;
    },

    /**
     * Get presigned URL for viewing/downloading a document
     */
    getDocumentViewUrl: async (
        documentId: string
    ): Promise<{ viewUrl: string; expiresIn: number }> => {
        const response = await apiClient.get<{ viewUrl: string; expiresIn: number }>(
            `/documents/${documentId}/view-url`
        );
        return response.data;
    },

    /**
     * Delete a document (removes from both S3 and database)
     */
    deleteDocument: async (documentId: string): Promise<void> => {
        await apiClient.delete(`/documents/${documentId}`);
    },

    // ============================================
    // CEPIK (TODO: Implement when API is ready)
    // ============================================

    getCEPIKHistory: async (driverId: string): Promise<CEPIKCheck[]> => {
        // TODO: Implement when API is ready
        // const response = await apiClient.get<CEPIKCheck[]>(`/drivers/${driverId}/cepik-history`);
        // return response.data;

        // MOCK DATA
        return Promise.resolve([
            {
                id: 'cepik-1',
                timestamp: new Date().toISOString(),
                status: 'ACTIVE',
                checkedBy: 'System',
            },
            {
                id: 'cepik-2',
                timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
                status: 'ACTIVE',
                checkedBy: 'A.Kowalska',
            },
        ]);
    },
};