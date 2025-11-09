// src/features/routes/hooks/useReorderStops.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routesApi } from '../api/routesApi';

interface ReorderStopsParams {
    routeId: string;
    stopOrders: Array<{
        stopId: string;
        newOrder: number;
    }>;
}

export const useReorderStops = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routeId, stopOrders }: ReorderStopsParams) =>
            routesApi.reorderStops(routeId, stopOrders),
        onSuccess: (_, variables) => {
            // Invaliduj cache dla tej konkretnej trasy
            queryClient.invalidateQueries({ queryKey: ['route', variables.routeId] });
            // Invaliduj też listę tras
            queryClient.invalidateQueries({ queryKey: ['routes'] });
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się zmienić kolejności stopów');
        },
    });
};