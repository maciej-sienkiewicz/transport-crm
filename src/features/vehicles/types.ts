// src/features/vehicles/types.ts
export type VehicleType = 'BUS' | 'MICROBUS' | 'VAN';

export type VehicleStatus = 'AVAILABLE' | 'IN_ROUTE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

export interface VehicleCapacity {
    totalSeats: number;
    wheelchairSpaces: number;
    childSeats: number;
}

export interface VehicleInsurance {
    policyNumber: string;
    validUntil: string;
    insurer: string;
}

export interface VehicleTechnicalInspection {
    validUntil: string;
    inspectionStation: string;
    issueDate?: string;
}

export interface Vehicle {
    id: string;
    companyId: string;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    vehicleType: VehicleType;
    capacity: VehicleCapacity;
    specialEquipment: string[];
    insurance: VehicleInsurance;
    technicalInspection: VehicleTechnicalInspection;
    status: VehicleStatus;
    currentMileage: number;
    vin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleListItem {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    vehicleType: VehicleType;
    status: VehicleStatus;
    capacity: {
        totalSeats: number;
        wheelchairSpaces: number;
    };
    insurance: {
        validUntil: string;
    };
    technicalInspection: {
        validUntil: string;
    };
}

export interface CreateVehicleRequest {
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    vehicleType: VehicleType;
    capacity: VehicleCapacity;
    specialEquipment: string[];
    insurance: VehicleInsurance;
    technicalInspection: {
        validUntil: string;
        inspectionStation: string;
    };
    vin?: string;
}

export interface UpdateVehicleRequest {
    registrationNumber: string;
    status: VehicleStatus;
    currentMileage: number;
    insurance: VehicleInsurance;
    technicalInspection: {
        validUntil: string;
        inspectionStation: string;
    };
}