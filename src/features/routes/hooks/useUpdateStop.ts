import {routeScheduleApi, UpdateStopRequest} from '../api/routeScheduleApi';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateStopParams {
    routeId: string;
    stopId: string;
    data: UpdateStopRequest;
}

export const useUpdateStop = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routeId, stopId, data }: UpdateStopParams) =>
            routeScheduleApi.updateStop(routeId, stopId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['route', variables.routeId] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });
            toast.success('Adres punktu został zaktualizowany');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się zaktualizować adresu');
        },
    });
};