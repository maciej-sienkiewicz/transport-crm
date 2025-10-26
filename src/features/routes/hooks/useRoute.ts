import { useQuery } from '@tanstack/react-query';
import { routesApi } from '../api/routesApi';

export const useRoute = (id: string) => {
    return useQuery({
        queryKey: ['route', id],
        queryFn: () => routesApi.getById(id),
        staleTime: 30_000,
        enabled: !!id,
    });
};