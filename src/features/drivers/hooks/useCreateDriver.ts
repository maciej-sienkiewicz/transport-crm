// src/features/drivers/hooks/useCreateDriver.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { driversApi } from '../api/driversApi';
import { CreateDriverRequest } from '../types';

export const useCreateDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDriverRequest) => driversApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            toast.success('Kierowca został pomyślnie dodany');
        },
    });
};