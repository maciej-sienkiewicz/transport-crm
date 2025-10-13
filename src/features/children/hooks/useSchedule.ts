// src/features/children/hooks/useSchedule.ts
import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '../api/schedulesApi';

export const useSchedule = (scheduleId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['schedule', scheduleId],
        queryFn: () => schedulesApi.getById(scheduleId),
        enabled: enabled && Boolean(scheduleId),
        staleTime: 30_000,
    });
};