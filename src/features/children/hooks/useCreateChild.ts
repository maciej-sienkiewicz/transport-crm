// src/features/children/hooks/useCreateChild.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { childrenApi } from '../api/childrenApi';
import { CreateChildRequest } from '../types';

export const useCreateChild = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateChildRequest) => childrenApi.create(data),
        onSuccess: (newChild) => {
            queryClient.invalidateQueries({ queryKey: ['children'] });
            toast.success('Dziecko zostało pomyślnie dodane');

            // Przekieruj na stronę szczegółową dziecka
            setTimeout(() => {
                window.history.pushState({}, '', `/children/${newChild.id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
            }, 500);
        },
    });
};