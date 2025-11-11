// src/shared/lib/absenceUtils.ts

import {AbsenceStatus, AbsenceType} from "@/shared/types/absence.ts";

export const absenceStatusLabels: Record<AbsenceStatus, string> = {
    PLANNED: 'Zaplanowana',
    ACTIVE: 'Aktywna',
    COMPLETED: 'Zakończona',
    CANCELLED: 'Anulowana',
};

export const absenceTypeLabels: Record<
    AbsenceType, string> = {
    FULL_DAY: 'Cały dzień',
    SPECIFIC_SCHEDULE: 'Specyficzny harmonogram',
};

export const getAbsenceStatusVariant = (
    status: AbsenceStatus
): 'primary' | 'warning' | 'default' | 'danger' => {
    switch (status) {
        case 'PLANNED':
            return 'primary';
        case 'ACTIVE':
            return 'warning';
        case 'COMPLETED':
            return 'default';
        case 'CANCELLED':
            return 'danger';
    }
};

export const getAbsenceUrgency = (
    startDate: string,
    status: AbsenceStatus
): 'urgent' | 'upcoming' | 'planned' | 'completed' => {
    if (status === 'COMPLETED' || status === 'CANCELLED') return 'completed';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((start.getTime() - today.getTime()) / 86400000);

    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 7) return 'upcoming';
    return 'planned';
};

export const formatAbsenceDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

export const formatAbsenceDateRange = (startDate: string, endDate: string): string => {
    if (startDate === endDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const absDate = new Date(startDate);
        absDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((absDate.getTime() - today.getTime()) / 86400000);

        if (diffDays === 0) return 'Dzisiaj';
        if (diffDays === 1) return 'Jutro';
        return formatAbsenceDate(startDate);
    }
    return `${formatAbsenceDate(startDate)} - ${formatAbsenceDate(endDate)}`;
};

export const formatAbsenceDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('pl-PL', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
};