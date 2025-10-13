// src/features/drivers/hooks/useDrivers.ts
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../api/driversApi';
import { PaginationParams } from '@/shared/types/api';
import { DriverStatus } from '../types';

interface UseDriversParams extends PaginationParams {
    status?: DriverStatus;
    search?: string;
}

export const useDrivers = (params: UseDriversParams) => {
    return useQuery({
        queryKey: ['drivers', params],
        queryFn: () => driversApi.getAll(params),
        staleTime: 30_000,
    });
};