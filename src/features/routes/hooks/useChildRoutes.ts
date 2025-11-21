import { useQuery } from '@tanstack/react-query';
import { childRoutesApi } from '../../children/api/childRoutesApi.ts';

interface UseChildRoutesParams {
    date?: string;
    from?: string;
    to?: string;
    type: 'history' | 'upcoming';
}

export const useChildRoutes = (childId: string, params: UseChildRoutesParams) => {
    return useQuery({
        queryKey: ['child-routes', childId, params],
        queryFn: () => childRoutesApi.getRoutes(childId, params),
        enabled: Boolean(childId),
        staleTime: 30_000,
    });
};