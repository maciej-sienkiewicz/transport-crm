// src/features/drivers/hooks/useUpdateDriver.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { driversApi } from '../api/driversApi';
import { UpdateDriverRequest } from '../types';

export const useUpdateDriver = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDriverRequest) => driversApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            queryClient.invalidateQueries({ queryKey: ['driver', id] });
            toast.success('Dane kierowcy zostały zaktualizowane');
        },
    });
};