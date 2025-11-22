// src/features/routes/hooks/useAddChildToSeries.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routeSeriesApi } from '../api/routeSeriesApi.ts';
import { AddScheduleToSeriesRequest } from '../types.ts';

interface AddChildToSeriesParams {
    seriesId: string;
    data: AddScheduleToSeriesRequest;
}

export const useAddChildToSeries = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ seriesId, data }: AddChildToSeriesParams) =>
            routeSeriesApi.addSchedule(seriesId, data),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['route-series', variables.seriesId] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });

            if (response.conflictResolved) {
                toast.success(response.message || 'Dziecko dodane z rozwiązaniem konfliktu');
            } else {
                toast.success(
                    `Dziecko dodane do serii!\nZaktualizowano ${response.existingRoutesUpdated} tras.`
                );
            }
        },
        onError: (error: any) => {
            // Nie wyświetlaj toasta dla błędu 409 - zostanie obsłużony przez modal
            if (error?.status === 409) {
                return;
            }
            toast.error(error?.message || 'Nie udało się dodać dziecka do serii');
        },
    });
};