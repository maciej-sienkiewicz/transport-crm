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
            console.log('🔴 useCreateRouteSeries onError:', error);
            console.log('🔴 error.statusCode:', error?.statusCode);
            console.log('🔴 error.isConflict:', error?.isConflict);
            console.log('🔴 error.data:', error?.data);

            // Nie wyświetlaj toasta dla błędu 409 - zostanie obsłużony przez modal
            if (error?.statusCode === 409 || error?.isConflict) {
                console.log('✅ Wykryto konflikt 409, nie pokazuję toasta, rzucam dalej');
                // WAŻNE: Musimy rzucić błąd dalej, żeby komponent mógł go złapać
                throw error;
            }
            toast.error(error?.message || 'Nie udało się utworzyć serii');
        },
    });
};