// src/shared/types/activity.ts
export type ActivityCategory =
    | 'CHILD'
    | 'GUARDIAN'
    | 'ROUTE'
    | 'SCHEDULE'
    | 'DRIVER'
    | 'VEHICLE'
    | 'ABSENCE';

export type ActivityType =
// Child activities
    | 'CHILD_CREATED'
    | 'CHILD_UPDATED'
    | 'CHILD_STATUS_CHANGED'
    | 'CHILD_ASSIGNED_TO_ROUTE'
    | 'CHILD_REMOVED_FROM_ROUTE'
    | 'CHILD_DELETED'
    // Guardian activities
    | 'GUARDIAN_CREATED'
    | 'GUARDIAN_UPDATED'
    | 'GUARDIAN_DELETED'
    | 'GUARDIAN_CHILD_ADDED'
    | 'GUARDIAN_LOGGED_IN'
    | 'GUARDIAN_PASSWORD_CHANGED'
    // Route activities
    | 'ROUTE_CREATED'
    | 'ROUTE_STATUS_CHANGED'
    | 'ROUTE_SCHEDULE_ADDED'
    | 'ROUTE_SCHEDULE_CANCELLED'
    | 'ROUTE_SCHEDULE_DELETED'
    | 'ROUTE_STOP_EXECUTED'
    | 'ROUTE_STOP_UPDATED'
    | 'ROUTE_STOPS_REORDERED'
    | 'ROUTE_NOTE_ADDED'
    | 'ROUTE_DELETED'
    // Schedule activities
    | 'SCHEDULE_CREATED'
    | 'SCHEDULE_UPDATED'
    | 'SCHEDULE_DELETED'
    // Driver activities
    | 'DRIVER_CREATED'
    | 'DRIVER_UPDATED'
    | 'DRIVER_STATUS_CHANGED'
    | 'DRIVER_ASSIGNED_TO_ROUTE'
    | 'DRIVER_DELETED'
    // Vehicle activities
    | 'VEHICLE_CREATED'
    | 'VEHICLE_UPDATED'
    | 'VEHICLE_STATUS_CHANGED'
    | 'VEHICLE_ASSIGNED_TO_ROUTE'
    | 'VEHICLE_DELETED';

export type UserRole = 'OPERATOR' | 'DRIVER' | 'GUARDIAN' | 'ADMIN';

export interface ActivityPerformedBy {
    name: string;
    role: UserRole;
}

export interface Activity {
    id: string;
    category: ActivityCategory;
    type: ActivityType;
    title: string;
    description: string;
    details: Record<string, string>;
    performedBy: ActivityPerformedBy;
    timestamp: string;
    metadata?: Record<string, string>;
}

export interface ActivityFilters {
    category?: ActivityCategory;
    page?: number;
    size?: number;
}