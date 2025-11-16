// src/features/drivers/types.ts - ROZSZERZENIE
import { Address } from '@/shared/types/api';

export type DriverStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface DrivingLicense {
    licenseNumber: string;
    categories: string[];
    validUntil: string;
}

export interface MedicalCertificate {
    validUntil: string;
    issueDate: string;
}

export interface CEPIKCheck {
    id: string;
    timestamp: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
    checkedBy: string;
}

export interface DriverDocument {
    id: string;
    name: string;
    type: 'CONTRACT' | 'AMENDMENT' | 'LICENSE_SCAN' | 'MEDICAL_SCAN' | 'LEAVE_REQUEST' | 'OTHER';
    fileUrl: string;
    fileSize: number;
    uploadedAt: string;
    uploadedBy: string;
}

export interface DriverNote {
    id: string;
    category: 'REMINDER' | 'PRAISE' | 'ISSUE' | 'OTHER';
    content: string;
    createdAt: string;
    createdByName: string;
}

export interface DriverStats {
    today: {
        completedRoutes: number;
        totalRoutes: number;
        hoursWorked: number;
        totalHours: number;
        kmDriven: number;
        currentVehicle?: string;
    };
    week: {
        totalRoutes: number;
        absences: number;
        delays: number;
        delayPercentage: number;
    };
}

export interface PlannedRoute {
    id: string;
    routeNumber: string;
    startTime: string;
    firstStopAddress: string;
    endLocation: string;
    childrenCount: number;
    vehicleId: string;
    vehicleRegistrationNumber: string;
    stopsCount: number;
    estimatedDuration?: number;
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface RouteHistoryItem {
    id: string;
    routeNumber: string;
    date: string;
    startTime: string;
    endTime: string;
    route: string;
    status: 'COMPLETED' | 'COMPLETED_WITH_DELAY' | 'CANCELLED';
    punctuality: boolean;
    delay?: number;
    childrenCount: number;
    distance: number;
    notes?: string;
}

export interface RouteHistorySummary {
    totalRoutes: number;
    totalHours: number;
    totalKm: number;
    averageRating: number;
    punctualityRate: number;
    punctualRoutes: number;
}

export interface Driver {
    id: string;
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: Address;
    drivingLicense: DrivingLicense;
    medicalCertificate: MedicalCertificate;
    status: DriverStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DriverDetail extends Driver {
    stats: DriverStats;
    nextRoute?: PlannedRoute;
    latestCEPIKCheck?: CEPIKCheck;
}

export interface DriverListItem {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    status: DriverStatus;
    drivingLicense: {
        categories: string[];
        validUntil: string;
    };
    medicalCertificate: {
        validUntil: string;
    };
    todayRoutesCount: number;
}

export interface CreateDriverRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: Address;
    drivingLicense: {
        licenseNumber: string;
        categories: string[];
        validUntil: string;
    };
    medicalCertificate: {
        validUntil: string;
        issueDate: string;
    };
}

export interface UpdateDriverRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address;
    status: DriverStatus;
    drivingLicense: {
        licenseNumber: string;
        categories: string[];
        validUntil: string;
    };
    medicalCertificate: {
        validUntil: string;
        issueDate: string;
    };
}

// src/features/drivers/types.ts - dodaj na końcu
export type DriverAbsenceType = 'SICK_LEAVE' | 'VACATION' | 'PERSONAL_LEAVE' | 'UNPAID_LEAVE' | 'OTHER';
export type DriverAbsenceStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface DriverAbsence {
    id: string;
    driverId: string;
    type: DriverAbsenceType;
    status: DriverAbsenceStatus;
    startDate: string;
    endDate: string;
    reason?: string;
    cancellationReason?: string;
    createdAt: string;
    createdBy: string;
}

export interface CreateDriverAbsenceRequest {
    type: DriverAbsenceType;
    startDate: string;
    endDate: string;
    reason?: string;
}

export interface CancelDriverAbsenceRequest {
    reason: string;
}

export interface DriverAbsencesResponse {
    absences: DriverAbsence[];
    totalCount: number;
}