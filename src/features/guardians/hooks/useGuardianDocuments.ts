import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api/guardiansApi';
import { GuardianDocumentType } from '../types';

export const useGuardianDocuments = (guardianId: string) => {
    return useQuery({
        queryKey: ['guardian-documents', guardianId],
        queryFn: () => guardiansApi.getDocuments(guardianId),
        enabled: Boolean(guardianId),
        staleTime: 30_000,
    });
};

export const useUploadGuardianDocument = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               file,
                               documentType,
                               notes
                           }: {
            file: File;
            documentType: GuardianDocumentType;
            notes?: string;
        }) => {
            const uploadUrlData = await guardiansApi.getDocumentUploadUrl(
                guardianId,
                file.name,
                file.size,
                file.type,
                documentType,
                notes
            );

            await guardiansApi.uploadToS3(uploadUrlData.uploadUrl, file);

            const result = await guardiansApi.confirmDocumentUpload(
                guardianId,
                file.name,
                file.size,
                file.type,
                uploadUrlData.s3Key,
                documentType,
                notes
            );

            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardian-documents', guardianId] });
            toast.success('Dokument został przesłany');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Nie udało się przesłać dokumentu');
        },
    });
};

export const useDeleteGuardianDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) => guardiansApi.deleteDocument(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardian-documents'] });
            toast.success('Dokument został usunięty');
        },
    });
};

export const useGuardianDocumentViewUrl = (documentId: string | null) => {
    return useQuery({
        queryKey: ['guardian-document-view-url', documentId],
        queryFn: () => guardiansApi.getDocumentViewUrl(documentId!),
        enabled: Boolean(documentId),
        staleTime: 0,
        gcTime: 0,
    });
};