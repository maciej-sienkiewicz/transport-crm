import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api/guardiansApi';
import { CreateGuardianRequest } from '../types';

export const useCreateGuardian = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGuardianRequest) => guardiansApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardians'] });
            toast.success('Opiekun został pomyślnie dodany');
        },
    });
};