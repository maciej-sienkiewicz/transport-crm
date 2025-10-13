import { useQuery } from '@tanstack/react-query';
import { childrenApi } from '../api/childrenApi';

export const useChild = (id: string) => {
    return useQuery({
        queryKey: ['child', id],
        queryFn: () => childrenApi.getById(id),
        enabled: Boolean(id),
        staleTime: 30_000,
    });
};