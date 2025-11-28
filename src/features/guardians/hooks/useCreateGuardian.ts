// src/features/guardians/hooks/useCreateGuardian.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api/guardiansApi';
import { CreateGuardianRequest } from '../types';

export const useCreateGuardian = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGuardianRequest) => guardiansApi.create(data),
        onSuccess: (newGuardian) => {
            queryClient.invalidateQueries({ queryKey: ['guardians'] });
            toast.success('Opiekun został pomyślnie dodany');

            // Przekieruj na stronę szczegółową opiekuna
            setTimeout(() => {
                window.history.pushState({}, '', `/guardians/${newGuardian.id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
            }, 500);
        },
    });
};