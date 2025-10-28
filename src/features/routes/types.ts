export type RouteStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ChildInRouteStatus = 'PENDING' | 'IN_VEHICLE' | 'DELIVERED' | 'ABSENT';

export type RoutePointType = 'PICKUP' | 'DROPOFF';

export interface RouteChild {
    childId: string;
    scheduleId: string;
    pickupOrder: number;
    estimatedPickupTime: string;
    estimatedDropoffTime: string;
}

export interface RoutePoint {
    id: string;
    type: RoutePointType;
    childId: string;
    scheduleId: string;
    order: number;
    address: {
        label: string;
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
    estimatedTime: string;
    childName: string;
    childAge: number;
    guardianName: string;
    guardianPhone: string;
    transportNeeds: {
        wheelchair: boolean;
        specialSeat: boolean;
        safetyBelt: boolean;
    };
}

export interface CreateRoutePointRequest {
    type: RoutePointType;
    childId: string;
    scheduleId: string;
    order: number;
    estimatedTime: string;
}

export interface CreateRouteRequest {
    routeName: string;
    date: string;
    driverId: string;
    vehicleId: string;
    estimatedStartTime: string;
    estimatedEndTime: string;
    points: CreateRoutePointRequest[];
}

export interface RouteChildDetail {
    id: string;
    firstName: string;
    lastName: string;
    pickupOrder: number;
    pickupAddress: {
        label: string;
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
    dropoffAddress: {
        label: string;
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
    estimatedPickupTime: string;
    estimatedDropoffTime: string;
    actualPickupTime?: string;
    actualDropoffTime?: string;
    status: ChildInRouteStatus;
    guardian: {
        firstName: string;
        lastName: string;
        phone: string;
    };
}

export interface RouteListItem {
    id: string;
    routeName: string;
    date: string;
    status: RouteStatus;
    driver: {
        id: string;
        firstName: string;
        lastName: string;
    };
    vehicle: {
        id: string;
        registrationNumber: string;
        model: string;
    };
    estimatedStartTime: string;
    estimatedEndTime: string;
    childrenCount: number;
}

export interface RouteDetail {
    id: string;
    companyId: string;
    routeName: string;
    date: string;
    status: RouteStatus;
    driver: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
    vehicle: {
        id: string;
        registrationNumber: string;
        make: string;
        model: string;
        capacity: number;
    };
    estimatedStartTime: string;
    estimatedEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    children: RouteChildDetail[];
    notes: Array<{
        id: string;
        author: string;
        content: string;
        createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface ChildSchedule {
    id: string;
    name: string;
    pickupTime: string;
    dropoffTime: string;
    pickupAddress: {
        label: string;
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
    dropoffAddress: {
        label: string;
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
}

export interface AvailableChild {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    disability: string[];
    transportNeeds: {
        wheelchair: boolean;
        specialSeat: boolean;
        safetyBelt: boolean;
    };
    // Backend zwraca płaską strukturę: każdy element array to jedno dziecko + jeden harmonogram
    schedule: ChildSchedule;
    guardian: {
        firstName: string;
        lastName: string;
        phone: string;
    };
}

export interface RouteBuilderChild extends AvailableChild {
    pickupOrder: number;
    estimatedPickupTime: string;
    estimatedDropoffTime: string;
}