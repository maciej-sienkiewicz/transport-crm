// src/features/dashboard/hooks/useAlerts.ts

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { AlertFilters } from '../types';

export const useAlerts = (filters: AlertFilters) => {
    return useQuery({
        queryKey: ['dashboard-alerts', filters.scope],
        queryFn: () => dashboardApi.getAlerts({ scope: filters.scope }),
        staleTime: 60_000,
    });
};