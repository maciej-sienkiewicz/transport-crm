import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { schedulesApi } from '../api/schedulesApi';
import { UpdateScheduleRequest } from '../types';

export const useUpdateSchedule = (scheduleId: string, childId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateScheduleRequest) =>
            schedulesApi.update(scheduleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['child', childId] });
            queryClient.invalidateQueries({ queryKey: ['schedules', childId] });
            queryClient.invalidateQueries({ queryKey: ['schedule', scheduleId] });
            toast.success('Harmonogram został zaktualizowany');
        },
    });
};