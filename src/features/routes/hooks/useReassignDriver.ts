// src/features/routes/hooks/useReassignDriver.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routesApi } from '../api/routesApi';

interface ReassignDriverParams {
    routeId: string;
    newDriverId: string;
    reason?: string;
}

export const useReassignDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routeId, newDriverId, reason }: ReassignDriverParams) =>
            routesApi.reassignDriver(routeId, { newDriverId, reason }),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['route', variables.routeId] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });
            queryClient.invalidateQueries({ queryKey: ['available-drivers'] });

            toast.success(response.message || 'Kierowca został pomyślnie zmieniony');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się zmienić kierowcy');
        },
    });
};