import { useQuery } from '@tanstack/react-query';
import { routesApi } from '../api/routesApi';

export const useAvailableChildren = (date: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['available-children', date],
        queryFn: () => routesApi.getAvailableChildren(date),
        enabled: enabled && !!date,
        staleTime: 60_000,
    });
};