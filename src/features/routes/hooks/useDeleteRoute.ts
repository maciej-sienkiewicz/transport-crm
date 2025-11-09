// src/features/routes/hooks/useDeleteRoute.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routesApi } from '../api/routesApi';

export const useDeleteRoute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => routesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['routes'] });
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się usunąć trasy');
        },
    });
};