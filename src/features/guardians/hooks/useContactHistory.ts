import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api/guardiansApi';
import { CreateContactHistoryRequest } from '../types';

export const useContactHistory = (guardianId: string) => {
    return useQuery({
        queryKey: ['contact-history', guardianId],
        queryFn: () => guardiansApi.getContactHistory(guardianId),
        enabled: Boolean(guardianId),
        staleTime: 30_000,
    });
};

export const useCreateContactHistory = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateContactHistoryRequest) =>
            guardiansApi.createContactHistory(guardianId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contact-history', guardianId] });
            queryClient.invalidateQueries({ queryKey: ['guardian-detail', guardianId] });
            toast.success('Kontakt został zapisany');
        },
    });
};

export const useDeleteContactHistory = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (contactId: string) =>
            guardiansApi.deleteContactHistory(guardianId, contactId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contact-history', guardianId] });
            toast.success('Kontakt został usunięty');
        },
    });
};