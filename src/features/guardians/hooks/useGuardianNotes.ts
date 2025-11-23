import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api/guardiansApi';
import { CreateGuardianNoteRequest } from '../types';

export const useGuardianNotes = (guardianId: string) => {
    return useQuery({
        queryKey: ['guardian-notes', guardianId],
        queryFn: () => guardiansApi.getNotes(guardianId),
        enabled: Boolean(guardianId),
        staleTime: 30_000,
    });
};

export const useCreateGuardianNote = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGuardianNoteRequest) =>
            guardiansApi.createNote(guardianId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardian-notes', guardianId] });
            toast.success('Notatka została dodana');
        },
    });
};

export const useUpdateGuardianNote = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteId, data }: { noteId: string; data: CreateGuardianNoteRequest }) =>
            guardiansApi.updateNote(guardianId, noteId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardian-notes', guardianId] });
            toast.success('Notatka została zaktualizowana');
        },
    });
};

export const useDeleteGuardianNote = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteId: string) => guardiansApi.deleteNote(guardianId, noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardian-notes', guardianId] });
            toast.success('Notatka została usunięta');
        },
    });
};