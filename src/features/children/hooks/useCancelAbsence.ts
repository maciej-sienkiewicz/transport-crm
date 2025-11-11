// src/features/children/hooks/useCancelAbsence.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { absencesApi } from '@/shared/api/absencesApi';
import { CancelAbsenceRequest } from '@/shared/types/absence';

export const useCancelAbsence = (childId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CancelAbsenceRequest }) =>
            absencesApi.cancelAbsence(id, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['child-absences', childId] });
            queryClient.invalidateQueries({ queryKey: ['child', childId] });

            if (response.affectedRouteStops.length > 0) {
                toast.success(
                    `Nieobecność anulowana. ${response.affectedRouteStops.length} przystanków wymaga przeglądu.`,
                    { duration: 5000 }
                );
            } else {
                toast.success('Nieobecność została anulowana');
            }
        },
    });
};