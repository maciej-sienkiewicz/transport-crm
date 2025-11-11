// src/features/routes/hooks/useRouteActivities.ts
import { useQuery } from '@tanstack/react-query';
import { ActivityFilters } from '@/shared/types/activity';
import { activitiesApi } from "@/shared/api/activities";

export const useRouteActivities = (routeId: string, filters: ActivityFilters = {}) => {
    return useQuery({
        queryKey: ['route-activities', routeId, filters],
        queryFn: () => activitiesApi.getRouteActivities(routeId, filters),
        enabled: Boolean(routeId),
        staleTime: 30_000,
    });
};