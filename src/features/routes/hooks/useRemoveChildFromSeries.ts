// src/features/routes/hooks/useRemoveChildFromSeries.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routeSeriesApi } from '../api/routeSeriesApi.ts';
import { RemoveScheduleFromSeriesRequest } from '../types.ts';

interface RemoveChildFromSeriesParams {
    seriesId: string;
    scheduleId: string;
    data: RemoveScheduleFromSeriesRequest;
}

export const useRemoveChildFromSeries = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ seriesId, scheduleId, data }: RemoveChildFromSeriesParams) =>
            routeSeriesApi.removeSchedule(seriesId, scheduleId, data),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['route-series', variables.seriesId] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });

            toast.success(
                `Dziecko usunięte z serii!\nAnulowano ${response.stopsCancelled} przystanków.`
            );
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się usunąć dziecka z serii');
        },
    });
};