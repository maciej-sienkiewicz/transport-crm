import { apiClient } from '@/shared/api/client';
import { PaginationParams, PageableResponse } from '@/shared/types/api';
import {
    Guardian,
    GuardianListItem,
    GuardianDetail,
    CreateGuardianRequest,
    UpdateGuardianRequest,
    GuardianNote,
    CreateGuardianNoteRequest,
    ContactHistoryItem,
    CreateContactHistoryRequest,
    GuardianDocument,
    GuardianDocumentType,
    UploadUrlResponse,
    DocumentUploadResult,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from '../types';

interface GetGuardiansParams extends PaginationParams {
    search?: string;
}

export const guardiansApi = {
    // ============================================
    // GUARDIANS CRUD
    // ============================================

    getAll: async (params: GetGuardiansParams): Promise<PageableResponse<GuardianListItem>> => {
        const response = await apiClient.get<PageableResponse<GuardianListItem>>('/guardians', {
            params: {
                page: params.page || 0,
                size: params.size || 20,
                sort: params.sort || 'lastName,asc',
                search: params.search,
            },
        });
        return response.data;
    },

    getById: async (id: string): Promise<GuardianDetail> => {
        const response = await apiClient.get<Guardian>(`/guardians/${id}`);
        const guardian = response.data;

        return guardian;
    },

    create: async (data: CreateGuardianRequest): Promise<Guardian> => {
        const response = await apiClient.post<Guardian>('/guardians', data);
        return response.data;
    },

    update: async (id: string, data: UpdateGuardianRequest): Promise<Guardian> => {
        const response = await apiClient.put<Guardian>(`/guardians/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/guardians/${id}`);
    },

    // ============================================
    // NOTES
    // ============================================

    getNotes: async (guardianId: string): Promise<GuardianNote[]> => {
        const response = await apiClient.get<GuardianNote[]>(
            `/guardians/${guardianId}/notes`
        );
        return response.data;
    },

    createNote: async (
        guardianId: string,
        data: CreateGuardianNoteRequest
    ): Promise<GuardianNote> => {
        const response = await apiClient.post<GuardianNote>(
            `/guardians/${guardianId}/notes`,
            data
        );
        return response.data;
    },

    updateNote: async (
        guardianId: string,
        noteId: string,
        data: CreateGuardianNoteRequest
    ): Promise<GuardianNote> => {
        const response = await apiClient.put<GuardianNote>(
            `/guardians/${guardianId}/notes/${noteId}`,
            data
        );
        return response.data;
    },

    deleteNote: async (guardianId: string, noteId: string): Promise<void> => {
        await apiClient.delete(`/guardians/${guardianId}/notes/${noteId}`);
    },

    // ============================================
    // CONTACT HISTORY
    // ============================================

    getContactHistory: async (guardianId: string): Promise<ContactHistoryItem[]> => {
        const response = await apiClient.get<ContactHistoryItem[]>(
            `/guardians/${guardianId}/contacts`
        );
        return response.data;
    },

    createContactHistory: async (
        guardianId: string,
        data: CreateContactHistoryRequest
    ): Promise<ContactHistoryItem> => {
        const response = await apiClient.post<ContactHistoryItem>(
            `/guardians/${guardianId}/contacts`,
            data
        );
        return response.data;
    },

    deleteContactHistory: async (guardianId: string, contactId: string): Promise<void> => {
        await apiClient.delete(`/guardians/${guardianId}/contacts/${contactId}`);
    },

    // ============================================
    // DOCUMENTS
    // ============================================

    getDocumentUploadUrl: async (
        guardianId: string,
        fileName: string,
        fileSize: number,
        contentType: string,
        documentType: GuardianDocumentType,
        notes?: string
    ): Promise<UploadUrlResponse> => {
        const response = await apiClient.post<UploadUrlResponse>(
            `/guardians/${guardianId}/documents/upload-url`,
            {
                documentType,
                fileName,
                contentType,
                fileSize,
            }
        );
        return response.data;
    },

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

    confirmDocumentUpload: async (
        guardianId: string,
        fileName: string,
        fileSize: number,
        contentType: string,
        s3Key: string,
        documentType: GuardianDocumentType,
        notes?: string
    ): Promise<DocumentUploadResult> => {
        const response = await apiClient.post<DocumentUploadResult>(
            `/guardians/${guardianId}/documents`,
            {
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

    getDocuments: async (guardianId: string): Promise<GuardianDocument[]> => {
        const response = await apiClient.get<{ documents: GuardianDocument[]; totalCount: number }>(
            `/guardians/${guardianId}/documents`
        );
        return response.data;
    },

    getDocumentViewUrl: async (
        documentId: string
    ): Promise<{ viewUrl: string; expiresIn: number }> => {
        const response = await apiClient.get<{ viewUrl: string; expiresIn: number }>(
            `/documents/${documentId}/view-url`
        );
        return response.data;
    },

    deleteDocument: async (documentId: string): Promise<void> => {
        await apiClient.delete(`/documents/${documentId}`);
    },

    // ============================================
    // ACCOUNT MANAGEMENT
    // ============================================

    resetPassword: async (
        guardianId: string,
        data: ResetPasswordRequest
    ): Promise<ResetPasswordResponse> => {
        const response = await apiClient.post<ResetPasswordResponse>(
            `/guardians/${guardianId}/reset-password`,
            data
        );
        return response.data;
    },

    createAccount: async (guardianId: string): Promise<{ accountCreated: boolean }> => {
        const response = await apiClient.post<{ accountCreated: boolean }>(
            `/guardians/${guardianId}/create-account`
        );
        return response.data;
    },

    deactivateAccount: async (guardianId: string): Promise<void> => {
        // TODO: Replace with real API call
        // await apiClient.post(`/guardians/${guardianId}/deactivate-account`);

        // MOCK - do nothing
        return Promise.resolve();
    },
};
