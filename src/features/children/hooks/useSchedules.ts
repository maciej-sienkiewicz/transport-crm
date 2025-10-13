import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '../api/schedulesApi';

export const useSchedules = (childId: string) => {
    return useQuery({
        queryKey: ['schedules', childId],
        queryFn: () => schedulesApi.getByChildId(childId),
        enabled: Boolean(childId),
        staleTime: 30_000,
    });
};