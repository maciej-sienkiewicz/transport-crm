import { useQuery } from '@tanstack/react-query';
import { routeHistoryApi } from '../api/routeHistoryApi';

interface UseRouteHistoryParams {
    scheduleId: string;
    page?: number;
    size?: number;
}

export const useRouteHistory = (params: UseRouteHistoryParams) => {
    return useQuery({
        queryKey: ['route-history', params.scheduleId, params.page, params.size],
        queryFn: () => routeHistoryApi.getHistory(params),
        enabled: Boolean(params.scheduleId),
        staleTime: 30_000,
    });
};