// src/features/children/hooks/useChildAbsences.ts
import { useQuery } from '@tanstack/react-query';
import { absencesApi } from '@/shared/api/absencesApi';
import { AbsenceFilters } from '@/shared/types/absence';

export const useChildAbsences = (childId: string, filters: AbsenceFilters = {}) => {
    return useQuery({
        queryKey: ['child-absences', childId, filters],
        queryFn: () => absencesApi.getChildAbsences(childId, filters),
        enabled: Boolean(childId),
        staleTime: 30_000,
    });
};