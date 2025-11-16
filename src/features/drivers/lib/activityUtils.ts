// src/features/drivers/lib/activityUtils.ts
import { ActivityCategory } from '@/shared/types/activity';

export const driverActivityCategoryLabels: Record<ActivityCategory, string> = {
    CHILD: 'Dziecko',
    GUARDIAN: 'Opiekun',
    ROUTE: 'Trasa',
    SCHEDULE: 'Harmonogram',
    DRIVER: 'Kierowca',
    VEHICLE: 'Pojazd',
};

export const formatActivityTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
        return date.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
        }) + ' (dzisiaj)';
    }

    if (diffDays === 1) {
        return date.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
        }) + ' (wczoraj)';
    }

    if (diffDays < 7) {
        return date.toLocaleDateString('pl-PL', {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getActivityColor = (category: ActivityCategory): string => {
    switch (category) {
        case 'ROUTE':
            return '#3b82f6';
        case 'DRIVER':
            return '#8b5cf6';
        case 'VEHICLE':
            return '#10b981';
        case 'CHILD':
            return '#f59e0b';
        case 'GUARDIAN':
            return '#ec4899';
        case 'SCHEDULE':
            return '#06b6d4';
        default:
            return '#64748b';
    }
};