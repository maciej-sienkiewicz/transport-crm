import { useQuery } from '@tanstack/react-query';
import { childrenApi } from '../api/childrenApi';
import { PaginationParams } from '@/shared/types/api';
import { ChildStatus } from '../types';

interface UseChildrenParams extends PaginationParams {
    status?: ChildStatus;
}

export const useChildren = (params: UseChildrenParams) => {
    return useQuery({
        queryKey: ['children', params],
        queryFn: () => childrenApi.getAll(params),
        staleTime: 30_000,
    });
};