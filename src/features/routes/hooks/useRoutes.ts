import { useQuery } from '@tanstack/react-query';
import { routesApi } from '../api/routesApi';
import { PaginationParams } from '@/shared/types/api';
import { RouteStatus } from '../types';

interface UseRoutesParams extends PaginationParams {
    date?: string;
    status?: RouteStatus;
    driverId?: string;
}

export const useRoutes = (params: UseRoutesParams) => {
    return useQuery({
        queryKey: ['routes', params],
        queryFn: () => routesApi.getAll(params),
        staleTime: 30_000,
    });
};