// src/features/drivers/hooks/useCEPIKHistory.ts
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../api/driversApi';

export const useCEPIKHistory = (driverId: string) => {
    return useQuery({
        queryKey: ['cepik-history', driverId],
        queryFn: () => driversApi.getCEPIKHistory(driverId),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });
};