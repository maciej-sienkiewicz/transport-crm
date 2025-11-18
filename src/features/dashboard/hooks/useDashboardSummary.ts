import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboardSummary = (date: string) => {
    return useQuery({
        queryKey: ['dashboard-summary', date],
        queryFn: () => dashboardApi.getSummary({ date }),
        staleTime: 60_000, // 1 minuta
        refetchInterval: 60_000, // Auto-refresh co minutę
        enabled: Boolean(date),
    });
};