import { useQuery } from '@tanstack/react-query';
import { routeHistoryApi } from '../api/routeHistoryApi';

interface UseUpcomingRoutesParams {
    scheduleId: string;
    page?: number;
    size?: number;
}

export const useUpcomingRoutes = (params: UseUpcomingRoutesParams) => {
    return useQuery({
        queryKey: ['upcoming-routes', params.scheduleId, params.page, params.size],
        queryFn: () => routeHistoryApi.getUpcoming(params),
        enabled: Boolean(params.scheduleId),
        staleTime: 30_000,
    });
};