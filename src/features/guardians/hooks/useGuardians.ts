import { useQuery } from '@tanstack/react-query';
import { guardiansApi } from '../api/guardiansApi';
import { PaginationParams } from '@/shared/types/api';

interface UseGuardiansParams extends PaginationParams {
    search?: string;
}

export const useGuardians = (params: UseGuardiansParams) => {
    return useQuery({
        queryKey: ['guardians', params],
        queryFn: () => guardiansApi.getAll(params),
        staleTime: 30_000,
    });
};