// src/features/dashboard/lib/utils.ts

/**
 * Formatuje datę do polskiego formatu
 */
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

/**
 * Formatuje datę do krótkiego formatu (np. "18 listopada")
 */
export const formatShortDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long'
    });
};

/**
 * Sprawdza czy data jest dzisiaj
 */
export const isToday = (dateStr: string): boolean => {
    const today = new Date();
    const date = new Date(dateStr);
    return (
        today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
    );
};

/**
 * Sprawdza czy data jest jutro
 */
export const isTomorrow = (dateStr: string): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateStr);
    return (
        tomorrow.getFullYear() === date.getFullYear() &&
        tomorrow.getMonth() === date.getMonth() &&
        tomorrow.getDate() === date.getDate()
    );
};

/**
 * Zwraca etykietę dla daty (Dzisiaj/Jutro/data)
 */
export const getDateLabel = (dateStr: string): string => {
    if (isToday(dateStr)) {
        return 'Dzisiaj';
    }
    if (isTomorrow(dateStr)) {
        return 'Jutro';
    }
    return formatShortDate(dateStr);
};

/**
 * Formatuje relatywny czas
 */
export const formatRelativeTime = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Przed chwilą';
    if (diffMins < 60) return `Przed ${diffMins} min`;

    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `Przed ${diffHours} godz.`;

    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 1) return 'Wczoraj';
    if (diffDays < 7) return `Przed ${diffDays} dni`;

    return timestamp.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'short'
    });
};

/**
 * Zwraca dzisiejszą datę w formacie ISO
 */
export const getTodayISO = (): string => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Zwraca jutrzejszą datę w formacie ISO
 */
export const getTomorrowISO = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};