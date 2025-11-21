import { useQuery } from '@tanstack/react-query';
import { routeHistoryApi } from '../api/routeHistoryApi';

interface UseRouteHistoryParams {
    scheduleId: string;
    page?: number;
    size?: number;
}

export const useRouteHistory = (params: UseRouteHistoryParams) => {
    return useQuery({
        queryKey: ['route-history', params],
        queryFn: () => routeHistoryApi.getHistory(params),
        enabled: Boolean(params.scheduleId),
        staleTime: 30_000,
    });
};