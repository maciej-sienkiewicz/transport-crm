// src/features/drivers/types.ts
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