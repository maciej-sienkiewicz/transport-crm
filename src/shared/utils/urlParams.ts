// src/shared/utils/urlParams.ts

/**
 * Pobiera parametry z URL query string
 */
export const getQueryParams = (): URLSearchParams => {
    return new URLSearchParams(window.location.search);
};

/**
 * Aktualizuje query params bez przeładowania strony
 */
export const updateQueryParams = (params: Record<string, string | null>) => {
    const url = new URL(window.location.href);

    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    });

    window.history.pushState({}, '', url.toString());
};

/**
 * Sprawdza czy data jest poprawna (YYYY-MM-DD)
 */
export const isValidDateString = (dateStr: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return false;
    }

    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Formatuje datę do ISO string (YYYY-MM-DD)
 */
export const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Pobiera datę na jutro
 */
export const getTomorrowDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateToISO(tomorrow);
};

/**
 * Pobiera dzisiejszą datę
 */
export const getTodayDate = (): string => {
    return formatDateToISO(new Date());
};