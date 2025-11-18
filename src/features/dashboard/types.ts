// src/features/dashboard/types.ts

export type ReadinessStatus = 'READY' | 'WARNING' | 'CRITICAL';

export type AlertType =
    | 'CHILDREN_NO_ROUTES'
    | 'ROUTES_NO_DRIVERS'
    | 'DRIVER_DOCUMENTS'
    | 'VEHICLE_DOCUMENTS'
    | 'ROUTES_NO_VEHICLES';

export type AlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DashboardSummary {
    date: string;
    readiness: ReadinessInfo;
    alerts: AlertsSummary;
}

export interface ReadinessInfo {
    status: ReadinessStatus;
    routesCount: number;
    childrenCount: number;
    driversCount: number;
    checks: ReadinessCheck[];
}

export interface ReadinessCheck {
    type: 'ROUTES_DRIVERS' | 'ROUTES_VEHICLES' | 'CHILDREN_ASSIGNED' | 'DRIVER_DOCUMENTS' | 'VEHICLES_TECHNICAL';
    status: 'OK' | 'WARNING' | 'ERROR';
    message: string;
    count?: number;
    totalCount?: number;
}

export interface AlertsSummary {
    childrenNoRoutes: number;
    routesNoDrivers: number;
    driverDocuments: number;
    vehicleDocuments: number;
    routesNoVehicles: number;
}

export interface DetailedAlert {
    type: AlertType;
    severity: AlertSeverity;
    count: number;
    items: AlertItem[];
}

export interface AlertItem {
    id: string;
    name: string;
    details: string;
    date?: string;
}

export interface TrendsData {
    current: WeekStats;
    previous: WeekStats;
    changes: WeekChanges;
}

export interface WeekStats {
    children: number;
    routes: number;
    cancellations: number;
}

export interface WeekChanges {
    children: {
        value: number;
        percentage: number;
        direction: 'UP' | 'DOWN' | 'NEUTRAL';
    };
    routes: {
        value: number;
        percentage: number;
        direction: 'UP' | 'DOWN' | 'NEUTRAL';
    };
    cancellations: {
        value: number;
        percentage: number;
        direction: 'UP' | 'DOWN' | 'NEUTRAL';
    };
}

export interface AlertFilters {
    scope: 'TOMORROW' | '3_DAYS' | '7_DAYS' | '30_DAYS';
}