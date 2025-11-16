// src/features/drivers/hooks/useDriverDocuments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { driversApi } from '../api/driversApi';
import { DriverDocument } from '../types';

export const useDriverDocuments = (driverId: string) => {
    return useQuery({
        queryKey: ['driver-documents', driverId],
        queryFn: () => driversApi.getDocuments(driverId),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });
};

export const useUploadDocument = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, type }: { file: File; type: DriverDocument['type'] }) =>
            driversApi.uploadDocument(driverId, file, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-documents', driverId] });
            toast.success('Dokument został przesłany');
        },
    });
};

export const useDeleteDocument = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) => driversApi.deleteDocument(driverId, documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-documents', driverId] });
            toast.success('Dokument został usunięty');
        },
    });
};