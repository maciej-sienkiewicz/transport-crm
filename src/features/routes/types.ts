export type RouteStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ChildInRouteStatus = 'PENDING' | 'IN_VEHICLE' | 'DELIVERED' | 'ABSENT';

export interface RouteChild {
    childId: string;
    scheduleId: string;
    pickupOrder: number;
    estimatedPickupTime: string;
    estimatedDropoffTime: string;
}

export interface CreateRouteRequest {
    routeName: string;
    date: string;
    driverId: string;
    vehicleId: string;
    estimatedStartTime: string;
    estimatedEndTime: string;
    children: RouteChild[];
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
    schedule: {
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
    };
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