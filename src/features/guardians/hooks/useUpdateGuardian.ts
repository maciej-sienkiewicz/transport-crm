import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api/guardiansApi';
import { UpdateGuardianRequest } from '../types';

export const useUpdateGuardian = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateGuardianRequest) => guardiansApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardians'] });
            queryClient.invalidateQueries({ queryKey: ['guardian', id] });
            toast.success('Dane opiekuna zostały zaktualizowane');
        },
    });
};