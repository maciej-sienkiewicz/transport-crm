import { useQuery } from '@tanstack/react-query';
import { guardiansApi } from '../api/guardiansApi';

export const useGuardian = (id: string) => {
    return useQuery({
        queryKey: ['guardian', id],
        queryFn: () => guardiansApi.getById(id),
        enabled: Boolean(id),
        staleTime: 30_000,
    });
};