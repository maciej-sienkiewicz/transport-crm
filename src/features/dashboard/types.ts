// src/features/dashboard/types.ts

// ============================================
// ENUMS & TYPES
// ============================================

/**
 * Globalny status gotowości operacyjnej (DEPRECATED - nie używany w nowym UI)
 */
export type ReadinessStatus = 'READY' | 'WARNING' | 'CRITICAL';

/**
 * Typy sprawdzeń gotowości
 */
export type CheckType =
    | 'ROUTES_DRIVERS'
    | 'ROUTES_VEHICLES'
    | 'CHILDREN_ASSIGNED'
    | 'DRIVER_DOCUMENTS'
    | 'VEHICLES_TECHNICAL';

/**
 * Status pojedynczego sprawdzenia
 */
export type CheckStatus = 'OK' | 'WARNING' | 'ERROR';

/**
 * Typy alertów
 */
export type AlertType =
    | 'CHILDREN_NO_ROUTES'
    | 'ROUTES_NO_DRIVERS'
    | 'DRIVER_DOCUMENTS'
    | 'VEHICLE_DOCUMENTS'
    | 'ROUTES_NO_VEHICLES';

/**
 * Priorytet alertu
 */
export type AlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * Zakres czasowy dla alertów
 */
export type AlertScope = 'TOMORROW' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'THIRTY_DAYS';

/**
 * Kierunek trendu
 */
export type TrendDirection = 'UP' | 'DOWN' | 'NEUTRAL';

/**
 * Etykieta dnia (do dual column)
 */
export type DayLabel = 'Dzisiaj' | 'Jutro';

// ============================================
// READINESS MODELS
// ============================================

/**
 * Pojedyncze sprawdzenie gotowości
 */
export interface ReadinessCheck {
    type: CheckType;
    status: CheckStatus;
    message: string;
    count?: number;
    totalCount?: number;
}

/**
 * Kompletna gotowość operacyjna na dany dzień
 */
export interface ReadinessInfo {
    status: ReadinessStatus;
    routesCount: number;
    childrenCount: number;
    driversCount: number;
    checks: ReadinessCheck[];
}

/**
 * Szybki przegląd liczb alertów (używany w /summary)
 */
export interface AlertsSummary {
    childrenNoRoutes: number;
    routesNoDrivers: number;
    driverDocuments: number;
    vehicleDocuments: number;
    routesNoVehicles: number;
}

/**
 * Dashboard Summary - główny response z /summary endpoint
 */
export interface DashboardSummary {
    date: string;
    readiness: ReadinessInfo;
    alerts: AlertsSummary;
}

// ============================================
// DAY COLUMN MODELS (NOWE)
// ============================================

/**
 * Dane dla pojedynczej kolumny dnia (Dzisiaj/Jutro)
 */
export interface DayColumnData {
    label: DayLabel;
    date: string;              // Sformatowana data (np. "18 listopada 2025")
    dateISO: string;           // ISO format (np. "2025-11-18")
    routesCount: number;
    childrenCount: number;
    checks: ReadinessCheck[];  // Zawsze 3 elementy po filtracji
}

/**
 * Akcja dla sprawdzenia
 */
export interface CheckAction {
    label: string;
    route: string;
}

// ============================================
// ALERTS MODELS
// ============================================

/**
 * Informacja o brakującym harmonogramie
 */
export interface MissingScheduleInfo {
    scheduleId: string;
    scheduleName: string;
    date: string;
    pickupTime: string;
    dropoffTime: string;
}

/**
 * Dziecko z listą brakujących harmonogramów
 */
export interface ChildWithSchedules {
    childId: string;
    firstName: string;
    lastName: string;
    missingSchedules: MissingScheduleInfo[];
}

/**
 * Szczegóły alertu dla dzieci bez tras
 */
export interface ChildrenAlert {
    type: AlertType;
    severity: AlertSeverity;
    uniqueChildrenCount: number;
    totalMissingSchedules: number;
    children: ChildWithSchedules[];
}

/**
 * Ogólny element alertu
 */
export interface AlertItem {
    id: string;
    name: string;
    details: string;
    date: string;
}

/**
 * Ogólny alert
 */
export interface DetailedAlert {
    type: AlertType;
    severity: AlertSeverity;
    count: number;
    items: AlertItem[];
}

/**
 * Response z /alerts endpoint
 */
export interface AlertsListResponse {
    childrenAlert: ChildrenAlert | null;
    otherAlerts: DetailedAlert[];
    totalCount: number;
    scope: AlertScope;
}

// ============================================
// TRENDS MODELS
// ============================================

/**
 * Zmiana trendu
 */
export interface TrendChange {
    value: number;
    percentage: number;
    direction: TrendDirection;
}

/**
 * Metryki tygodniowe
 */
export interface WeeklyMetrics {
    children: number;
    routes: number;
    cancellations: number;
}

/**
 * Trendy tygodniowe
 */
export interface TrendsData {
    current: WeeklyMetrics;
    previous: WeeklyMetrics;
    changes: {
        children: TrendChange;
        routes: TrendChange;
        cancellations: TrendChange;
    };
}

// ============================================
// FILTERS & PARAMS
// ============================================

/**
 * Parametry filtrowania alertów
 */
export interface AlertFilters {
    scope: AlertScope;
}