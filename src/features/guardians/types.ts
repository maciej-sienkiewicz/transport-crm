import { Address } from '@/shared/types/api';

export interface Guardian {
    id: string;
    companyId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    address?: Address;
    childrenCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface GuardianListItem {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    childrenCount: number;
}

export interface GuardianChild {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    relationship: GuardianRelationship;
    isPrimary: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'TEMPORARY_INACTIVE';
}

export interface GuardianDetail extends Guardian {
    children: GuardianChild[];
    accountInfo: {
        hasAccount: boolean;
        lastLogin?: string;
        loginCount30Days: number;
        loginCount7Days: number;
        accountCreatedAt?: string;
        accountStatus?: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
    };
    stats: {
        totalChildren: number;
        activeChildren: number;
        upcomingRoutes: number;
        recentContacts: number;
    };
}

export type GuardianRelationship =
    | 'PARENT'
    | 'LEGAL_GUARDIAN'
    | 'GRANDPARENT'
    | 'RELATIVE'
    | 'OTHER';

export interface CreateGuardianRequest {
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string;
    address: Address | null;
}

export interface UpdateGuardianRequest {
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string;
    address: Address | null;
}

// Notatki o opiekunie
export type GuardianNoteCategory = 'GENERAL' | 'COMPLAINT' | 'PRAISE' | 'PAYMENT' | 'URGENT';

export interface GuardianNote {
    id: string;
    guardianId: string;
    category: GuardianNoteCategory;
    content: string;
    createdAt: string;
    createdByName: string;
    createdById: string;
}

export interface CreateGuardianNoteRequest {
    category: GuardianNoteCategory;
    content: string;
}

// Historia kontaktów
export type ContactType = 'PHONE_CALL' | 'EMAIL' | 'IN_PERSON' | 'OTHER';

export interface ContactHistoryItem {
    id: string;
    guardianId: string;
    type: ContactType;
    subject: string;
    notes: string;
    contactedAt: string;
    handledByName: string;
}

export interface CreateContactHistoryRequest {
    type: ContactType;
    subject: string;
    notes: string;
}

// Dokumenty
export type GuardianDocumentType =
    | 'GUARDIAN_ID_SCAN'
    | 'GUARDIAN_AUTHORIZATION'
    | 'GUARDIAN_CONTRACT'
    | 'GUARDIAN_PAYMENT_CONFIRMATION'
    | 'GUARDIAN_OTHER';

export interface GuardianDocument {
    id: string;
    documentType: GuardianDocumentType;
    fileName: string;
    fileSize: number;
    contentType: string;
    uploadedByName: string;
    uploadedAt: string;
    notes?: string;
    isPdf: boolean;
    isImage: boolean;
}

export interface UploadUrlResponse {
    uploadUrl: string;
    s3Key: string;
    expiresIn: number;
}

export interface DocumentUploadResult {
    id: string;
    fileName: string;
    fileSize: number;
    contentType: string;
    s3Key: string;
}

// Zarządzanie kontem
export interface ResetPasswordRequest {
    sendEmail: boolean;
    sendSms: boolean;
}

export interface ResetPasswordResponse {
    temporaryPassword?: string;
    emailSent: boolean;
    smsSent: boolean;
    expiresAt: string;
}