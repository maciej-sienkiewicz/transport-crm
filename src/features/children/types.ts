import { Address } from '@/shared/types/api';

export type ChildStatus = 'ACTIVE' | 'INACTIVE' | 'TEMPORARY_INACTIVE';

export type DisabilityType =
    | 'INTELLECTUAL'
    | 'PHYSICAL'
    | 'SENSORY_VISUAL'
    | 'SENSORY_HEARING'
    | 'AUTISM'
    | 'MULTIPLE'
    | 'SPEECH'
    | 'MENTAL';

export type GuardianRelationship =
    | 'PARENT'
    | 'LEGAL_GUARDIAN'
    | 'GRANDPARENT'
    | 'RELATIVE'
    | 'OTHER';

export type DayOfWeek =
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';

export interface TransportNeeds {
    wheelchair: boolean;
    specialSeat: boolean;
    safetyBelt: boolean;
}

export interface ChildGuardian {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    relationship: GuardianRelationship;
    isPrimary: boolean;
    canPickup: boolean;
    canAuthorize: boolean;
}

export interface ScheduleAddress extends Address {
    label: string;
}

export interface ChildSchedule {
    id: string;
    name: string;
    days: DayOfWeek[];
    pickupTime: string;
    pickupAddress: ScheduleAddress;
    dropoffTime: string;
    dropoffAddress: ScheduleAddress;
    active: boolean;
}

export interface Child {
    id: string;
    companyId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    age: number;
    status: ChildStatus;
    disability: DisabilityType[];
    transportNeeds: TransportNeeds;
    notes?: string;
    guardiansCount: number;
    activeSchedulesCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ChildListItem {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    age: number;
    status: ChildStatus;
    disability: DisabilityType[];
    transportNeeds: TransportNeeds;
    guardiansCount: number;
    activeSchedulesCount: number;
}

export interface ChildDetail extends Child {
    guardians: ChildGuardian[];
    schedules: ChildSchedule[];
}

export interface CreateChildRequest {
    child: {
        firstName: string;
        lastName: string;
        birthDate: string;
        disability: DisabilityType[];
        transportNeeds: TransportNeeds;
        notes?: string;
    };
    guardian: {
        existingId?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        relationship?: GuardianRelationship;
    };
}

export interface UpdateChildRequest {
    firstName: string;
    lastName: string;
    birthDate: string;
    status: ChildStatus;
    disability: DisabilityType[];
    transportNeeds: TransportNeeds;
    notes?: string;
}