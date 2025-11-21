// src/features/drivers/hooks/useAvailableDriversForDate.ts

import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../api/driversApi';

export const useAvailableDriversForDate = (date: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['available-drivers', date],
        queryFn: () => driversApi.getAvailableDrivers(date),
        enabled: enabled && !!date,
        staleTime: 60_000,
    });
};