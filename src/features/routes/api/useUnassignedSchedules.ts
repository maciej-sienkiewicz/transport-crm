// src/features/routes/hooks/useUnassignedSchedules.ts
import { useQuery } from '@tanstack/react-query';
import { unassignedSchedulesApi } from '../api/unassignedSchedulesApi';

export const useUnassignedSchedules = (date: string) => {
    return useQuery({
        queryKey: ['unassigned-schedules', date],
        queryFn: () => unassignedSchedulesApi.getUnassigned(date),
        enabled: Boolean(date),
        staleTime: 30_000,
    });
};