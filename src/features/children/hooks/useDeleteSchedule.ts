import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { schedulesApi } from '../api/schedulesApi';

export const useDeleteSchedule = (childId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (scheduleId: string) => schedulesApi.delete(scheduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['child', childId] });
            queryClient.invalidateQueries({ queryKey: ['schedules', childId] });
            toast.success('Harmonogram został usunięty');
        },
    });
};