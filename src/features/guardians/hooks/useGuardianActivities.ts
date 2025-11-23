// src/features/guardians/hooks/useGuardianActivities.ts
import { useQuery } from '@tanstack/react-query';
import { ActivityFilters } from '@/shared/types/activity';
import { activitiesApi } from '@/shared/api/activities';

export const useGuardianActivities = (guardianId: string, filters: ActivityFilters = {}) => {
    return useQuery({
        queryKey: ['guardian-activities', guardianId, filters],
        queryFn: () => activitiesApi.getGuardianActivities(guardianId, filters),
        enabled: Boolean(guardianId),
        staleTime: 30_000,
    });
};