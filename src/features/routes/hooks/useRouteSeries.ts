// src/features/routes/hooks/useRouteSeries.ts

import { useQuery } from '@tanstack/react-query';
import { routeSeriesApi } from '../api/routeSeriesApi.ts';
import { PaginationParams } from '@/shared/types/api.ts';
import { RouteSeriesStatus } from '../types.ts';

interface UseRouteSeriesParams extends PaginationParams {
    status?: RouteSeriesStatus;
}

export const useRouteSeries = (params: UseRouteSeriesParams) => {
    return useQuery({
        queryKey: ['route-series', params],
        queryFn: () => routeSeriesApi.getAll(params),
        staleTime: 30_000,
    });
};