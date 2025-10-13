import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { schedulesApi } from '../api/schedulesApi.ts';
import { CreateScheduleRequest } from '../types.ts';

export const useCreateSchedule = (childId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateScheduleRequest) =>
            schedulesApi.create(childId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['child', childId] });
            queryClient.invalidateQueries({ queryKey: ['schedules', childId] });
            toast.success('Harmonogram został dodany');
        },
    });
};