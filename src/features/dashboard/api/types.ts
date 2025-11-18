// src/features/dashboard/api/types.ts

import {
    DashboardSummary,
    DetailedAlert,
    TrendsData,
    AlertType
} from '../types';

export interface GetDashboardSummaryParams {
    date: string; // ISO format: YYYY-MM-DD
}

export interface GetAlertsParams {
    scope: 'TOMORROW' | '3_DAYS' | '7_DAYS' | '30_DAYS';
}

export interface DashboardSummaryResponse extends DashboardSummary {}

export interface AlertsResponse {
    alerts: DetailedAlert[];
    totalCount: number;
    scope: string;
}

export interface TrendsResponse extends TrendsData {}