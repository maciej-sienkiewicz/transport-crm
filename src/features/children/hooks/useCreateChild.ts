import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { childrenApi } from '../api/childrenApi';
import { CreateChildRequest } from '../types';

export const useCreateChild = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateChildRequest) => childrenApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['children'] });
            toast.success('Dziecko zostało pomyślnie dodane');
        },
    });
};