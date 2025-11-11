// src/shared/lib/activityUtils.ts

import {ActivityCategory, ActivityType} from "@/shared/types/activity.ts";

export const activityTypeLabels: Record<ActivityType, string> = {
    // Child
    CHILD_CREATED: 'Utworzono dziecko',
    CHILD_UPDATED: 'Zaktualizowano dane dziecka',
    CHILD_STATUS_CHANGED: 'Zmieniono status dziecka',
    CHILD_ASSIGNED_TO_ROUTE: 'Przypisano do trasy',
    CHILD_REMOVED_FROM_ROUTE: 'Usunięto z trasy',
    CHILD_DELETED: 'Usunięto dziecko',
    // Guardian
    GUARDIAN_CREATED: 'Utworzono opiekuna',
    GUARDIAN_UPDATED: 'Zaktualizowano dane opiekuna',
    GUARDIAN_DELETED: 'Usunięto opiekuna',
    GUARDIAN_CHILD_ADDED: 'Dodano dziecko',
    GUARDIAN_LOGGED_IN: 'Logowanie opiekuna',
    GUARDIAN_PASSWORD_CHANGED: 'Zmiana hasła',
    // Route
    ROUTE_CREATED: 'Utworzono trasę',
    ROUTE_STATUS_CHANGED: 'Zmieniono status trasy',
    ROUTE_SCHEDULE_ADDED: 'Dodano harmonogram',
    ROUTE_SCHEDULE_CANCELLED: 'Anulowano harmonogram',
    ROUTE_SCHEDULE_DELETED: 'Usunięto harmonogram',
    ROUTE_STOP_EXECUTED: 'Wykonano przystanek',
    ROUTE_STOP_UPDATED: 'Zaktualizowano przystanek',
    ROUTE_STOPS_REORDERED: 'Zmieniono kolejność przystanków',
    ROUTE_NOTE_ADDED: 'Dodano notatkę',
    ROUTE_DELETED: 'Usunięto trasę',
    // Schedule
    SCHEDULE_CREATED: 'Utworzono harmonogram',
    SCHEDULE_UPDATED: 'Zaktualizowano harmonogram',
    SCHEDULE_DELETED: 'Usunięto harmonogram',
    // Driver
    DRIVER_CREATED: 'Utworzono kierowcę',
    DRIVER_UPDATED: 'Zaktualizowano dane kierowcy',
    DRIVER_STATUS_CHANGED: 'Zmieniono status kierowcy',
    DRIVER_ASSIGNED_TO_ROUTE: 'Przypisano do trasy',
    DRIVER_DELETED: 'Usunięto kierowcę',
    // Vehicle
    VEHICLE_CREATED: 'Utworzono pojazd',
    VEHICLE_UPDATED: 'Zaktualizowano dane pojazdu',
    VEHICLE_STATUS_CHANGED: 'Zmieniono status pojazdu',
    VEHICLE_ASSIGNED_TO_ROUTE: 'Przypisano do trasy',
    VEHICLE_DELETED: 'Usunięto pojazd',
};

export const activityCategoryLabels: Record<ActivityCategory, string> = {
    CHILD: 'Dziecko',
    GUARDIAN: 'Opiekun',
    ROUTE: 'Trasa',
    SCHEDULE: 'Harmonogram',
    DRIVER: 'Kierowca',
    VEHICLE: 'Pojazd',
    ABSENCE: "Nieobecność"
};

export const getActivityColor = (category: ActivityCategory): string => {
    switch (category) {
        case 'CHILD':
            return '#10b981'; // green
        case 'GUARDIAN':
            return '#8b5cf6'; // purple
        case 'ROUTE':
            return '#06b6d4'; // cyan
        case 'SCHEDULE':
            return '#3b82f6'; // blue
        case 'DRIVER':
            return '#f59e0b'; // amber
        case 'VEHICLE':
            return '#ec4899'; // pink
        default:
            return '#64748b'; // slate
    }
};

export const formatActivityTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('pl-PL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Przed chwilą';
    if (diffMins < 60) return `${diffMins} min temu`;
    if (diffHours < 24) return `${diffHours} godz. temu`;
    if (diffDays === 1) return 'Wczoraj';
    if (diffDays < 7) return `${diffDays} dni temu`;
    return time.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' });
};