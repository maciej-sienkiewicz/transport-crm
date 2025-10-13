import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api/guardiansApi';

export const useDeleteGuardian = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => guardiansApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardians'] });
            toast.success('Opiekun został usunięty');
        },
    });
};