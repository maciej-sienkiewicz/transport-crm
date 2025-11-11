// src/features/children/hooks/useCreateAbsence.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { absencesApi } from '@/shared/api/absencesApi';
import { CreateAbsenceRequest } from '@/shared/types/absence';

export const useCreateAbsence = (childId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAbsenceRequest) =>
            absencesApi.createAbsence(childId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['child-absences', childId] });
            queryClient.invalidateQueries({ queryKey: ['child', childId] });
            toast.success('Nieobecność została zgłoszona');
        },
    });
};