import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useTrends = () => {
    return useQuery({
        queryKey: ['dashboard-trends'],
        queryFn: () => dashboardApi.getTrends(),
        staleTime: 5 * 60_000, // 5 minut
        refetchInterval: 5 * 60_000, // Auto-refresh co 5 minut
    });
};