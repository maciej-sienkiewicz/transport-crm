import {
    DashboardSummary,
    AlertScope,
} from '../types';

export interface GetDashboardSummaryParams {
    date: string; // ISO format: YYYY-MM-DD
}

export interface GetAlertsParams {
    scope: AlertScope;
}

export interface DashboardSummaryResponse extends DashboardSummary {}

export interface AlertsResponse {
    childrenAlert: any | null; // From backend
    otherAlerts: Array<{
        type: string;
        severity: string;
        count: number;
        items: any[];
    }>;
    totalCount: number;
    scope: AlertScope;
}

export interface TrendsResponse {
    current: {
        children: number;
        routes: number;
        cancellations: number;
    };
    previous: {
        children: number;
        routes: number;
        cancellations: number;
    };
    changes: {
        children: {
            value: number;
            percentage: number;
            direction: 'UP' | 'DOWN' | 'NEUTRAL';
        };
        routes: {
            value: number;
            percentage: number;
            direction: 'UP' | 'DOWN' | 'NEUTRAL';
        };
        cancellations: {
            value: number;
            percentage: number;
            direction: 'UP' | 'DOWN' | 'NEUTRAL';
        };
    };
}