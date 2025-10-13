import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routesApi } from '../api/routesApi';
import { CreateRouteRequest } from '../types';

export const useCreateRoute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRouteRequest) => routesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['routes'] });
            toast.success('Trasa została pomyślnie utworzona');
        },
    });
};