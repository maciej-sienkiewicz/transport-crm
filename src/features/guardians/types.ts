import { Address, CommunicationPreference } from '@/shared/types/api';

export interface Guardian {
    id: string;
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    address: Address;
    communicationPreference: CommunicationPreference;
    childrenCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface GuardianListItem {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
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
}

export interface GuardianDetail extends Guardian {
    children: GuardianChild[];
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
    email: string;
    phone: string;
    alternatePhone?: string;
    address: Address;
    communicationPreference: CommunicationPreference;
}

export interface UpdateGuardianRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    address: Address;
    communicationPreference: CommunicationPreference;
}