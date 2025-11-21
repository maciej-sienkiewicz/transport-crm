// src/features/routes/hooks/useRouteSeriesDetail.ts

import { useQuery } from '@tanstack/react-query';
import { routeSeriesApi } from '../api/routeSeriesApi.ts';

export const useRouteSeriesDetail = (seriesId: string | null, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['route-series', seriesId],
        queryFn: () => routeSeriesApi.getById(seriesId!),
        enabled: options?.enabled !== false && !!seriesId,
        staleTime: 30_000,
    });
};