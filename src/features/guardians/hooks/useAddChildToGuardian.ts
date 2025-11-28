// src/features/guardians/hooks/useAddChildToGuardian.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { childrenApi } from '@/features/children/api/childrenApi';
import { guardianAssignmentApi } from '@/features/children/api/guardianAssignmentApi';
import { CreateChildRequest } from '@/features/children/types';
import { AddChildFormData } from '../components/AddChildToGuardianModal/AddChildToGuardianModal';

interface AddChildToGuardianParams {
    guardianId: string;
    childData: AddChildFormData;
}

export const useAddChildToGuardian = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ guardianId, childData }: AddChildToGuardianParams) => {
            // Krok 1: Utwórz dziecko z istniejącym opiekunem
            const createChildRequest: CreateChildRequest = {
                child: {
                    firstName: childData.firstName,
                    lastName: childData.lastName,
                    birthDate: childData.birthDate,
                    disability: childData.disability,
                    transportNeeds: childData.transportNeeds,
                    notes: childData.notes,
                },
                guardian: {
                    existingId: guardianId,
                },
            };

            const newChild = await childrenApi.create(createChildRequest);

            // Krok 2: Aktualizuj relację opiekuna z dzieckiem
            // (jeśli isPrimary lub inne parametry są inne niż domyślne)
            if (childData.isPrimary || childData.relationship !== 'PARENT') {
                await guardianAssignmentApi.assign(guardianId, newChild.id, {
                    relationship: childData.relationship,
                    isPrimary: childData.isPrimary,
                    canPickup: true,
                    canAuthorize: true,
                });
            }

            return newChild;
        },
        onSuccess: (newChild, { guardianId }) => {
            // Odśwież listy i szczegóły
            queryClient.invalidateQueries({ queryKey: ['guardian-detail', guardianId] });
            queryClient.invalidateQueries({ queryKey: ['guardians'] });
            queryClient.invalidateQueries({ queryKey: ['children'] });
            queryClient.invalidateQueries({ queryKey: ['child', newChild.id] });

            toast.success(
                `Dziecko ${newChild.firstName} ${newChild.lastName} zostało pomyślnie dodane`
            );

            // Przekieruj na stronę szczegółową dziecka
            setTimeout(() => {
                window.history.pushState({}, '', `/children/${newChild.id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
            }, 500);
        },
        onError: (error: any) => {
            console.error('Error adding child to guardian:', error);
            toast.error(
                error?.response?.data?.message ||
                'Nie udało się dodać dziecka. Spróbuj ponownie.'
            );
        },
    });
};