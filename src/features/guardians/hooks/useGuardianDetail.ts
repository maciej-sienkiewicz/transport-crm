// src/features/guardians/hooks/useGuardianDetail.ts
import { useQuery } from '@tanstack/react-query';
import { guardiansApi } from '../api/guardiansApi';

export const useGuardianDetail = (id: string) => {
    return useQuery({
        queryKey: ['guardian-detail', id],
        queryFn: () => guardiansApi.getById(id),
        enabled: Boolean(id),
        staleTime: 30_000,
    });
};