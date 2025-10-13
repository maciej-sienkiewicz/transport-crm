// src/features/drivers/hooks/useDriver.ts
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../api/driversApi';

export const useDriver = (id: string) => {
    return useQuery({
        queryKey: ['driver', id],
        queryFn: () => driversApi.getById(id),
        enabled: Boolean(id),
        staleTime: 30_000,
    });
};