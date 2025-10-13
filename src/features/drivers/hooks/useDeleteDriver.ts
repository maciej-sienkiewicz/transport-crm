// src/features/drivers/hooks/useDeleteDriver.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { driversApi } from '../api/driversApi';

export const useDeleteDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => driversApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            toast.success('Kierowca został usunięty');
        },
    });
};