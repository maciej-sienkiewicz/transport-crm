// src/shared/types/routeImpact.ts

export interface AffectedRoute {
    id: string;
    routeName: string;
    date: string;
    previousStatus: string;
    newStatus: string;
}

export interface AffectedSeries {
    id: string;
    seriesName: string;
    startDate: string;
    endDate: string | null;
}

export interface RouteImpactData {
    title: string;
    message: string;
    affectedRoutes?: AffectedRoute[];
    affectedSeries?: AffectedSeries[];
    timestamp?: string;
    variant?: 'info' | 'warning' | 'danger';
}

// Response z backendu przy tworzeniu nieobecności kierowcy
export interface CreateDriverAbsenceResponse {
    id: string;
    driverId: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string | null;
    status: string;
    createdBy: string;
    createdByRole: string;
    createdAt: string;
    cancelledAt: string | null;
    cancellationReason: string | null;
    conflictingRoutesCount: number;
    routesUpdated: number;
    seriesUpdated: number;
    affectedRoutes: AffectedRoute[];
    affectedSeries: AffectedSeries[];
}