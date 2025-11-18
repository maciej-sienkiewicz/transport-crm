// src/features/dashboard/hooks/useDashboardSummary.ts

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboardSummary = (date: string) => {
    return useQuery({
        queryKey: ['dashboard-summary', date],
        queryFn: () => dashboardApi.getSummary({ date }),
        staleTime: 60_000, // 1 minuta
        enabled: Boolean(date),
    });
};