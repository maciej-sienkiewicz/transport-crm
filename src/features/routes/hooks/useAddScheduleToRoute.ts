// src/features/routes/hooks/useAddScheduleToRoute.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { routeScheduleApi, AddScheduleToRouteRequest } from '../api/routeScheduleApi';

interface AddScheduleParams {
    routeId: string;
    data: AddScheduleToRouteRequest;
}

export const useAddScheduleToRoute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routeId, data }: AddScheduleParams) =>
            routeScheduleApi.addScheduleToRoute(routeId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['route', variables.routeId] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });

            queryClient.invalidateQueries({ queryKey: ['unassigned-schedules'] });
            queryClient.invalidateQueries({ queryKey: ['available-children'] });

            toast.success('Dziecko zostało dodane do trasy');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się dodać dziecka do trasy');
        },
    });
};