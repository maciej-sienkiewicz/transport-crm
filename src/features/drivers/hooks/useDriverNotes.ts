// src/features/drivers/hooks/useDriverNotes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { driversApi } from '../api/driversApi';
import { DriverNote } from '../types';

export const useDriverNotes = (driverId: string) => {
    return useQuery({
        queryKey: ['driver-notes', driverId],
        queryFn: () => driversApi.getNotes(driverId),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });
};

export const useCreateNote = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { category: DriverNote['category']; content: string }) =>
            driversApi.createNote(driverId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-notes', driverId] });
            toast.success('Notatka została dodana');
        },
    });
};

export const useUpdateNote = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteId, data }: { noteId: string; data: { category: DriverNote['category']; content: string } }) =>
            driversApi.updateNote(driverId, noteId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-notes', driverId] });
            toast.success('Notatka została zaktualizowana');
        },
    });
};

export const useDeleteNote = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteId: string) => driversApi.deleteNote(driverId, noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-notes', driverId] });
            toast.success('Notatka została usunięta');
        },
    });
};