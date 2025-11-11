// src/shared/types/absence.ts
export type AbsenceType = 'FULL_DAY' | 'SPECIFIC_SCHEDULE';

export type AbsenceStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type CreatedByRole = 'ADMIN' | 'OPERATOR' | 'GUARDIAN';

export interface Absence {
    id: string;
    childId: string;
    type: AbsenceType;
    startDate: string;
    endDate: string;
    scheduleId: string | null;
    scheduleName: string | null;
    reason: string | null;
    status: AbsenceStatus;
    createdByRole: CreatedByRole;
    createdAt: string;
    cancelledAt: string | null;
    cancellationReason: string | null;
    affectedRouteStops: number | null;
}

export interface CreateAbsenceRequest {
    type: AbsenceType;
    startDate: string;
    endDate: string;
    scheduleId: string | null;
    reason?: string;
}

export interface CancelAbsenceRequest {
    reason: string;
}

export interface CancelAbsenceResponse {
    id: string;
    cancelledAt: string;
    message: string;
    affectedRouteStops: string[];
}

export interface AbsenceStats {
    childId: string;
    periodFrom: string;
    periodTo: string;
    totalAbsences: number;
    totalDays: number;
    byType: {
        FULL_DAY: number;
        SPECIFIC_SCHEDULE: number;
    };
    byStatus: {
        PLANNED: number;
        ACTIVE: number;
        COMPLETED: number;
        CANCELLED: number;
    };
}

export interface AbsenceFilters {
    from?: string;
    to?: string;
    statuses?: AbsenceStatus[];
}