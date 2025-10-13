import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { childrenApi } from '../api/childrenApi';
import { UpdateChildRequest } from '../types';

export const useUpdateChild = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateChildRequest) => childrenApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['children'] });
            queryClient.invalidateQueries({ queryKey: ['child', id] });
            toast.success('Dane dziecka zostały zaktualizowane');
        },
    });
};