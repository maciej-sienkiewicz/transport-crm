// src/features/routes/hooks/useUpdateRouteStatus.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routesApi } from '../api/routesApi';
import { UpdateRouteStatusRequest } from '../types';

interface UpdateRouteStatusParams {
    routeId: string;
    data: UpdateRouteStatusRequest;
}

export const useUpdateRouteStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routeId, data }: UpdateRouteStatusParams) =>
            routesApi.updateStatus(routeId, data),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['route', variables.routeId] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });

            toast.success('Status trasy został zaktualizowany');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się zaktualizować statusu trasy');
        },
    });
};