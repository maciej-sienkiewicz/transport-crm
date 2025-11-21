// src/features/routes/hooks/useCancelRouteSeries.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routeSeriesApi } from '../api/routeSeriesApi.ts';
import { CancelRouteSeriesRequest } from '../types.ts';

interface CancelRouteSeriesParams {
    seriesId: string;
    data: CancelRouteSeriesRequest;
}

export const useCancelRouteSeries = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ seriesId, data }: CancelRouteSeriesParams) =>
            routeSeriesApi.cancel(seriesId, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['route-series'] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });

            toast.success(
                `Seria anulowana!\nAnulowano ${response.futureRoutesCancelled} przyszłych tras.`
            );
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się anulować serii');
        },
    });
};