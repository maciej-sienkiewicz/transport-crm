// src/features/dashboard/lib/constants.ts

import { AlertType, ReadinessStatus } from '../types';

export const READINESS_STATUS_LABELS: Record<ReadinessStatus, string> = {
    READY: 'SYSTEM GOTOWY NA JUTRZEJSZE OPERACJE',
    WARNING: 'SYSTEM WYMAGA UWAGI',
    CRITICAL: 'KRYTYCZNE PROBLEMY - SYSTEM NIE GOTOWY',
};

export const READINESS_STATUS_COLORS: Record<ReadinessStatus, string> = {
    READY: '#10b981',
    WARNING: '#f59e0b',
    CRITICAL: '#ef4444',
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
    CHILDREN_NO_ROUTES: 'Dzieci bez tras',
    ROUTES_NO_DRIVERS: 'Trasy bez kierowców',
    DRIVER_DOCUMENTS: 'Dokumenty kierowców',
    VEHICLE_DOCUMENTS: 'Dokumenty pojazdów',
    ROUTES_NO_VEHICLES: 'Trasy bez pojazdów',
};

export const ALERT_SCOPE_LABELS = {
    TOMORROW: 'Jutro',
    '3_DAYS': '3 dni',
    '7_DAYS': '7 dni',
    '30_DAYS': '30 dni',
};