// src/features/drivers/hooks/useDriverActivities.ts
import { useQuery } from '@tanstack/react-query';
import { ActivityFilters } from '@/shared/types/activity';
import { activitiesApi } from '@/shared/api/activities';

export const useDriverActivities = (driverId: string, filters: ActivityFilters = {}) => {
    return useQuery({
        queryKey: ['driver-activities', driverId, filters],
        queryFn: () => activitiesApi.getDriverActivities(driverId, filters),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });
};