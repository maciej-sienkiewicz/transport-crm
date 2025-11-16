// src/features/drivers/hooks/useDriverDetail.ts
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../api/driversApi';

export const useDriverDetail = (id: string) => {
    return useQuery({
        queryKey: ['driver-detail', id],
        queryFn: () => driversApi.getById(id),
        enabled: Boolean(id),
        staleTime: 30_000,
    });
};