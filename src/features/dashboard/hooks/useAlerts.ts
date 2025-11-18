import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { AlertScope } from '../types';

interface UseAlertsParams {
    scope: AlertScope;
}

export const useAlerts = ({ scope }: UseAlertsParams) => {
    return useQuery({
        queryKey: ['dashboard-alerts', scope],
        queryFn: () => dashboardApi.getAlerts({ scope }),
        staleTime: 60_000, // 1 minuta
        refetchInterval: 60_000, // Auto-refresh co minutę
    });
};