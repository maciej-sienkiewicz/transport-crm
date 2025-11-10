export type RouteStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type StopType = 'PICKUP' | 'DROPOFF';

export type ExecutionStatus = 'COMPLETED' | 'NO_SHOW' | 'REFUSED';

export interface AddressWithCoordinates {
    label: string;
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    postalCode: string;
    city: string;
    latitude?: number | null;
    longitude?: number | null;
}

export interface TransportNeeds {
    wheelchair: boolean;
    specialSeat: boolean;
    safetyBelt: boolean;
}

export interface Guardian {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface RouteStop {
    id: string;
    stopOrder: number;
    stopType: StopType;
    childId: string;
    childFirstName: string;
    childLastName: string;
    scheduleId: string;
    estimatedTime: string;
    address: AddressWithCoordinates;
    isCancelled: boolean;
    cancelledAt: string | null;
    cancellationReason: string | null;
    actualTime: string | null;
    executionStatus: ExecutionStatus | null;
    executionNotes: string | null;
    executedByName: string | null;
    guardian: Guardian;
    transportNeeds: TransportNeeds;
}

export interface CreateStopRequest {
    stopOrder: number;
    stopType: StopType;
    childId: string;
    scheduleId: string;
    estimatedTime: string;
    address: AddressWithCoordinates;
}

export interface CreateRouteRequest {
    routeName: string;
    date: string;
    driverId: string;
    vehicleId: string;
    estimatedStartTime: string;
    estimatedEndTime: string;
    stops: CreateStopRequest[];
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
    stopsCount: number;
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
        capacity: {
            totalSeats: number;
            wheelchairSpaces: number;
        };
    };
    estimatedStartTime: string;
    estimatedEndTime: string;
    actualStartTime: string | null;
    actualEndTime: string | null;
    stops: RouteStop[];
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
    pickupAddress: AddressWithCoordinates;
    dropoffAddress: AddressWithCoordinates;
}

export interface AvailableChild {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    disability: string[];
    transportNeeds: TransportNeeds;
    schedule: ChildSchedule;
    guardian: Guardian;
}

export interface LocalRouteStop {
    id: string;
    type: StopType;
    childId: string;
    scheduleId: string;
    order: number;
    address: AddressWithCoordinates;
    estimatedTime: string;
    childName: string;
    childAge: number;
    guardianName: string;
    guardianPhone: string;
    transportNeeds: TransportNeeds;
}

export interface ChildStopInfo {
    stopId: string;
    stopOrder: number;
    stopType: StopType;
    childFirstName: string;
    childLastName: string;
    estimatedTime: string;
    address: AddressWithCoordinates;
}

export interface RouteHistoryItem {
    id: string;
    routeName: string;
    date: string;
    status: 'COMPLETED' | 'CANCELLED';
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
    actualStartTime: string;
    actualEndTime: string;
    stopsCount: number;
    completedStopsCount: number;
}

export interface UpcomingRouteItem {
    id: string;
    routeName: string;
    date: string;
    status: 'PLANNED' | 'IN_PROGRESS';
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
    stopsCount: number;
    childStops: ChildStopInfo[];
}