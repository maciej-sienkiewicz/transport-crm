// src/features/routes/hooks/useCreateRouteSeries.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routeSeriesApi } from '../api/routeSeriesApi.ts';
import { CreateRouteSeriesRequest } from '../types.ts';

interface CreateRouteSeriesParams {
    routeId: string;
    data: CreateRouteSeriesRequest;
}

export const useCreateRouteSeries = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routeId, data }: CreateRouteSeriesParams) =>
            routeSeriesApi.createFromRoute(routeId, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['route-series'] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });

            toast.success(
                `Seria utworzona pomyślnie!\nWygenerowano ${response.routesMaterialized} tras.`
            );
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się utworzyć serii');
        },
    });
};