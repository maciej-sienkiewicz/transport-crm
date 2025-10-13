import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { childrenApi } from '../api/childrenApi';

export const useDeleteChild = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => childrenApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['children'] });
            toast.success('Dziecko zostało usunięte');
        },
    });
};