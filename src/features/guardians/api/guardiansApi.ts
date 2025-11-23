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

        // TODO: Remove mock data when API is ready
        const guardianDetail: GuardianDetail = {
            ...guardian,
            children: [
                {
                    id: 'child-1',
                    firstName: 'Anna',
                    lastName: guardian.lastName,
                    age: 8,
                    relationship: 'PARENT',
                    isPrimary: true,
                    status: 'ACTIVE',
                },
                {
                    id: 'child-2',
                    firstName: 'Tomasz',
                    lastName: guardian.lastName,
                    age: 6,
                    relationship: 'PARENT',
                    isPrimary: false,
                    status: 'ACTIVE',
                },
            ],
            accountInfo: {
                hasAccount: true,
                lastLogin: new Date(Date.now() - 2 * 3600000).toISOString(),
                loginCount30Days: 24,
                loginCount7Days: 8,
                accountCreatedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
                accountStatus: 'ACTIVE',
            },
            stats: {
                totalChildren: 2,
                activeChildren: 2,
                upcomingRoutes: 5,
                recentContacts: 3,
            },
        };

        return guardianDetail;
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
        // TODO: Replace with real API call
        // const response = await apiClient.get<{ notes: GuardianNote[] }>(
        //     `/guardians/${guardianId}/notes`
        // );
        // return response.data.notes;

        // MOCK DATA
        return Promise.resolve([
            {
                id: 'note-1',
                guardianId,
                category: 'GENERAL',
                content: 'Opiekun bardzo zaangażowany w sprawy dzieci. Zawsze odbiera telefon i szybko odpowiada na wiadomości.',
                createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
                createdByName: 'Anna Kowalska',
                createdById: 'user-1',
            },
            {
                id: 'note-2',
                guardianId,
                category: 'PRAISE',
                content: 'Pochwała od kierowcy - zawsze punktualny, dzieci przygotowane.',
                createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
                createdByName: 'Jan Nowak',
                createdById: 'user-2',
            },
            {
                id: 'note-3',
                guardianId,
                category: 'PAYMENT',
                content: 'Opłata za styczeń 2025 wpłacona z 2-dniowym opóźnieniem.',
                createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
                createdByName: 'System',
                createdById: 'system',
            },
        ]);
    },

    createNote: async (
        guardianId: string,
        data: CreateGuardianNoteRequest
    ): Promise<GuardianNote> => {
        // TODO: Replace with real API call
        // const response = await apiClient.post<GuardianNote>(
        //     `/guardians/${guardianId}/notes`,
        //     data
        // );
        // return response.data;

        // MOCK DATA
        return Promise.resolve({
            id: `note-${Date.now()}`,
            guardianId,
            category: data.category,
            content: data.content,
            createdAt: new Date().toISOString(),
            createdByName: 'Bieżący użytkownik',
            createdById: 'current-user',
        });
    },

    updateNote: async (
        guardianId: string,
        noteId: string,
        data: CreateGuardianNoteRequest
    ): Promise<GuardianNote> => {
        // TODO: Replace with real API call
        // const response = await apiClient.put<GuardianNote>(
        //     `/guardians/${guardianId}/notes/${noteId}`,
        //     data
        // );
        // return response.data;

        // MOCK DATA
        return Promise.resolve({
            id: noteId,
            guardianId,
            category: data.category,
            content: data.content,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            createdByName: 'Bieżący użytkownik',
            createdById: 'current-user',
        });
    },

    deleteNote: async (guardianId: string, noteId: string): Promise<void> => {
        // TODO: Replace with real API call
        // await apiClient.delete(`/guardians/${guardianId}/notes/${noteId}`);

        // MOCK - do nothing
        return Promise.resolve();
    },

    // ============================================
    // CONTACT HISTORY
    // ============================================

    getContactHistory: async (guardianId: string): Promise<ContactHistoryItem[]> => {
        // TODO: Replace with real API call
        // const response = await apiClient.get<{ contacts: ContactHistoryItem[] }>(
        //     `/guardians/${guardianId}/contacts`
        // );
        // return response.data.contacts;

        // MOCK DATA
        return Promise.resolve([
            {
                id: 'contact-1',
                guardianId,
                type: 'PHONE_CALL',
                subject: 'Zgłoszenie nieobecności dziecka',
                notes: 'Opiekun zgłosił nieobecność Anny na najbliższy piątek z powodu wizyty u lekarza. Potwierdził, że zostanie w domu.\n\nAkcja: Zaktualizowano harmonogram i poinformowano kierowcę.',
                contactedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
                handledByName: 'Katarzyna Wiśniewska',
            },
            {
                id: 'contact-2',
                guardianId,
                type: 'EMAIL',
                subject: 'Pytanie o zmianę godziny odbioru',
                notes: 'Opiekun zapytał o możliwość zmiany stałej godziny odbioru z 15:00 na 15:30 od przyszłego tygodnia.\n\nAkcja: Sprawdzono dostępność. Zmiana możliwa. Wysłano potwierdzenie emailem.',
                contactedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
                handledByName: 'Marek Kowalski',
            },
            {
                id: 'contact-3',
                guardianId,
                type: 'PHONE_CALL',
                subject: 'Informacja o opóźnieniu na trasie',
                notes: 'Poinformowano opiekuna o 15-minutowym opóźnieniu na trasie porannej z powodu korku.\n\nOpiekun potwierdził, że będzie czekał. Podziękował za informację.',
                contactedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
                handledByName: 'Anna Kowalska',
            },
            {
                id: 'contact-4',
                guardianId,
                type: 'IN_PERSON',
                subject: 'Spotkanie w sprawie nowego harmonogramu',
                notes: 'Spotkanie w biurze w sprawie ustalenia nowego harmonogramu na II semestr. Omówiono godziny, trasy i preferencje.\n\nUstalenia: Odbiór pozostaje bez zmian, dowóz o 30 min wcześniej od marca.',
                contactedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
                handledByName: 'Piotr Nowak',
            },
        ]);
    },

    createContactHistory: async (
        guardianId: string,
        data: CreateContactHistoryRequest
    ): Promise<ContactHistoryItem> => {
        // TODO: Replace with real API call
        // const response = await apiClient.post<ContactHistoryItem>(
        //     `/guardians/${guardianId}/contacts`,
        //     data
        // );
        // return response.data;

        // MOCK DATA
        return Promise.resolve({
            id: `contact-${Date.now()}`,
            guardianId,
            type: data.type,
            subject: data.subject,
            notes: data.notes,
            contactedAt: new Date().toISOString(),
            handledByName: 'Bieżący użytkownik',
        });
    },

    deleteContactHistory: async (guardianId: string, contactId: string): Promise<void> => {
        // TODO: Replace with real API call
        // await apiClient.delete(`/guardians/${guardianId}/contacts/${contactId}`);

        // MOCK - do nothing
        return Promise.resolve();
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
        // TODO: Replace with real API call
        // const response = await apiClient.post<UploadUrlResponse>(
        //     `/guardians/${guardianId}/documents/upload-url`,
        //     {
        //         entityType: 'GUARDIAN',
        //         entityId: guardianId,
        //         documentType,
        //         fileName,
        //         contentType,
        //         fileSize,
        //     }
        // );
        // return response.data;

        // MOCK DATA - simulate presigned URL
        return Promise.resolve({
            uploadUrl: `https://mock-s3.example.com/upload/${guardianId}/${fileName}`,
            s3Key: `guardians/${guardianId}/${Date.now()}-${fileName}`,
            expiresIn: 3600,
        });
    },

    uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
        // TODO: In real implementation, this uploads to S3
        // const response = await fetch(presignedUrl, {
        //     method: 'PUT',
        //     body: file,
        //     headers: {
        //         'Content-Type': file.type,
        //     },
        // });
        //
        // if (!response.ok) {
        //     throw new Error(`S3 upload failed: ${response.statusText}`);
        // }

        // MOCK - simulate delay
        return new Promise((resolve) => setTimeout(resolve, 1000));
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
        // TODO: Replace with real API call
        // const response = await apiClient.post<DocumentUploadResult>(
        //     `/guardians/${guardianId}/documents`,
        //     {
        //         documentType,
        //         fileName,
        //         fileSize,
        //         contentType,
        //         s3Key,
        //         notes,
        //     }
        // );
        // return response.data;

        // MOCK DATA
        return Promise.resolve({
            id: `doc-${Date.now()}`,
            fileName,
            fileSize,
            contentType,
            s3Key,
        });
    },

    getDocuments: async (guardianId: string): Promise<GuardianDocument[]> => {
        // TODO: Replace with real API call
        // const response = await apiClient.get<{ documents: GuardianDocument[]; totalCount: number }>(
        //     `/guardians/${guardianId}/documents`
        // );
        // return response.data.documents;

        // MOCK DATA
        return Promise.resolve([
            {
                id: 'doc-1',
                documentType: 'GUARDIAN_ID_SCAN',
                fileName: 'dowod_osobisty_skan.pdf',
                fileSize: 2458624,
                contentType: 'application/pdf',
                uploadedByName: 'Anna Kowalska',
                uploadedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
                notes: 'Skan dowodu ważny do 2028',
                isPdf: true,
                isImage: false,
            },
            {
                id: 'doc-2',
                documentType: 'GUARDIAN_AUTHORIZATION',
                fileName: 'upowaznienie_babcia.pdf',
                fileSize: 1234567,
                contentType: 'application/pdf',
                uploadedByName: 'Marek Kowalski',
                uploadedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
                notes: 'Upoważnienie dla babci do odbioru dzieci',
                isPdf: true,
                isImage: false,
            },
            {
                id: 'doc-3',
                documentType: 'GUARDIAN_PAYMENT_CONFIRMATION',
                fileName: 'potwierdzenie_styczen_2025.jpg',
                fileSize: 856234,
                contentType: 'image/jpeg',
                uploadedByName: 'System',
                uploadedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
                isPdf: false,
                isImage: true,
            },
        ]);
    },

    getDocumentViewUrl: async (
        documentId: string
    ): Promise<{ viewUrl: string; expiresIn: number }> => {
        // TODO: Replace with real API call
        // const response = await apiClient.get<{ viewUrl: string; expiresIn: number }>(
        //     `/documents/${documentId}/view-url`
        // );
        // return response.data;

        // MOCK DATA - simulate presigned view URL
        return Promise.resolve({
            viewUrl: `https://mock-s3.example.com/view/${documentId}`,
            expiresIn: 3600,
        });
    },

    deleteDocument: async (documentId: string): Promise<void> => {
        // TODO: Replace with real API call
        // await apiClient.delete(`/documents/${documentId}`);

        // MOCK - do nothing
        return Promise.resolve();
    },

    // ============================================
    // ACCOUNT MANAGEMENT
    // ============================================

    resetPassword: async (
        guardianId: string,
        data: ResetPasswordRequest
    ): Promise<ResetPasswordResponse> => {
        // TODO: Replace with real API call
        // const response = await apiClient.post<ResetPasswordResponse>(
        //     `/guardians/${guardianId}/reset-password`,
        //     data
        // );
        // return response.data;

        // MOCK DATA
        return Promise.resolve({
            temporaryPassword: undefined,
            emailSent: data.sendEmail,
            smsSent: data.sendSms,
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
        });
    },

    createAccount: async (guardianId: string): Promise<{ accountCreated: boolean }> => {
        // TODO: Replace with real API call
        // const response = await apiClient.post<{ accountCreated: boolean }>(
        //     `/guardians/${guardianId}/create-account`
        // );
        // return response.data;

        // MOCK DATA
        return Promise.resolve({
            accountCreated: true,
        });
    },

    deactivateAccount: async (guardianId: string): Promise<void> => {
        // TODO: Replace with real API call
        // await apiClient.post(`/guardians/${guardianId}/deactivate-account`);

        // MOCK - do nothing
        return Promise.resolve();
    },
};
