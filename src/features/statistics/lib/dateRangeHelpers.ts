// src/features/statistics/lib/dateRangeHelpers.ts

import { DateRange } from '../api/types';

/**
 * Format date to ISO 8601 string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get date N days ago from today
 */
export const getDaysAgo = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

/**
 * Get yesterday's date (since data is always D-1)
 */
export const getYesterday = (): Date => {
    return getDaysAgo(1);
};

/**
 * Get default date range (last 7 days, ending yesterday)
 */
export const getDefaultDateRange = (): DateRange => {
    const endDate = getYesterday(); // Yesterday (D-1)
    const startDate = getDaysAgo(7); // 7 days ago

    return {
        startDate: formatDateISO(startDate),
        endDate: formatDateISO(endDate),
    };
};

/**
 * Get date range for preset periods
 */
export const getPresetDateRange = (
    preset: '7days' | '30days' | '90days' | '180days'
): DateRange => {
    const endDate = getYesterday();

    const daysMap = {
        '7days': 7,
        '30days': 30,
        '90days': 90,
        '180days': 180,
    };

    const startDate = getDaysAgo(daysMap[preset]);

    return {
        startDate: formatDateISO(startDate),
        endDate: formatDateISO(endDate),
    };
};

/**
 * Create custom date range
 */
export const createCustomDateRange = (startDate: Date, endDate: Date): DateRange => {
    return {
        startDate: formatDateISO(startDate),
        endDate: formatDateISO(endDate),
    };
};

/**
 * Format date for display (Polish locale)
 */
export const formatDateDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

/**
 * Format date range for display
 */
export const formatDateRangeDisplay = (dateRange: DateRange): string => {
    return `${formatDateDisplay(dateRange.startDate)} - ${formatDateDisplay(dateRange.endDate)}`;
};

/**
 * Calculate number of days in date range
 */
export const getDaysInRange = (dateRange: DateRange): number => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
};

/**
 * Validate date range (max 180 days)
 */
export const validateDateRange = (dateRange: DateRange): boolean => {
    const days = getDaysInRange(dateRange);
    const endDate = new Date(dateRange.endDate);
    const yesterday = getYesterday();

    // Check if end date is not in the future (max = yesterday)
    if (endDate > yesterday) {
        return false;
    }

    // Check if range is not longer than 180 days
    if (days > 180) {
        return false;
    }

    return true;
};

/**
 * Get label for preset
 */
export const getPresetLabel = (preset: '7days' | '30days' | '90days' | '180days'): string => {
    const labels = {
        '7days': 'Ostatnie 7 dni',
        '30days': 'Ostatnie 30 dni',
        '90days': 'Ostatnie 90 dni',
        '180days': 'Ostatnie 180 dni',
    };
    return labels[preset];
};