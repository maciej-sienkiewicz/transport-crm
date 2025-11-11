// src/features/children/hooks/useChildActivities.ts
import { useQuery } from '@tanstack/react-query';
import { ActivityFilters } from '@/shared/types/activity';
import {activitiesApi} from "@/shared/api/activities.ts";

export const useChildActivities = (childId: string, filters: ActivityFilters = {}) => {
    return useQuery({
        queryKey: ['child-activities', childId, filters],
        queryFn: () => activitiesApi.getChildActivities(childId, filters),
        enabled: Boolean(childId),
        staleTime: 30_000,
    });
};