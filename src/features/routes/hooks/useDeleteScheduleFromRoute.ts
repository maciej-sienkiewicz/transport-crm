import {useMutation, useQueryClient} from "@tanstack/react-query";
import {routeScheduleApi} from "@/features/routes/api/routeScheduleApi.ts";
import toast from "react-hot-toast";

export const useDeleteScheduleFromRoute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routeId, scheduleId }: { routeId: string; scheduleId: string }) =>
            routeScheduleApi.deleteScheduleFromRoute(routeId, scheduleId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['route', variables.routeId] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });
            queryClient.invalidateQueries({ queryKey: ['available-children'] });
            toast.success('Dziecko zostało usunięte z trasy');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się usunąć dziecka z trasy');
        },
    });
};