// src/features/drivers/hooks/useDriverDocuments.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { driversApi } from '../api/driversApi';
import { DocumentType } from '../types';

export const useDriverDocuments = (driverId: string) => {
    return useQuery({
        queryKey: ['driver-documents', driverId],
        queryFn: () => driversApi.getDocuments(driverId),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });
};

// src/features/drivers/hooks/useDriverDocuments.ts

export const useUploadDocument = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               file,
                               documentType,
                               notes
                           }: {
            file: File;
            documentType: DocumentType;
            notes?: string;
        }) => {
            console.log('🚀 STEP 1: Starting upload flow', {
                fileName: file.name,
                fileSize: file.size,
                documentType
            });

            // Krok 1: Pobierz presigned URL
            console.log('📡 STEP 2: Getting presigned URL...');
            const uploadUrlData = await driversApi.getDocumentUploadUrl(
                driverId,
                file.name,
                file.size,
                file.type,
                documentType,
                notes
            );
            console.log('✅ STEP 2: Got presigned URL:', uploadUrlData);

            // Krok 2: Upload do S3
            console.log('☁️ STEP 3: Uploading to S3...');
            try {
                await driversApi.uploadToS3(uploadUrlData.uploadUrl, file);
                console.log('✅ STEP 3: S3 upload successful');
            } catch (error) {
                console.error('❌ STEP 3: S3 upload failed:', error);
                throw new Error(`S3 upload failed: ${error}`);
            }

            // Krok 3: Potwierdź upload
            console.log('💾 STEP 4: Confirming upload...');
            try {
                const result = await driversApi.confirmDocumentUpload(
                    driverId,
                    file.name,
                    file.size,
                    file.type,
                    uploadUrlData.s3Key,
                    documentType,
                    notes
                );
                console.log('✅ STEP 4: Upload confirmed:', result);
                return result;
            } catch (error) {
                console.error('❌ STEP 4: Confirm failed:', error);
                throw new Error(`Confirm upload failed: ${error}`);
            }
        },
        onSuccess: () => {
            console.log('🎉 Upload complete! Invalidating queries...');
            queryClient.invalidateQueries({ queryKey: ['driver-documents', driverId] });
            queryClient.invalidateQueries({ queryKey: ['driver-detail', driverId] });
            toast.success('Dokument został przesłany');
        },
        onError: (error: any) => {
            console.error('💥 Upload failed:', error);
            toast.error(error?.message || 'Nie udało się przesłać dokumentu');
        },
    });
};

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) => driversApi.deleteDocument(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-documents'] });
            toast.success('Dokument został usunięty');
        },
        onError: () => {
            toast.error('Nie udało się usunąć dokumentu');
        },
    });
};

export const useDocumentViewUrl = (documentId: string | null) => {
    return useQuery({
        queryKey: ['document-view-url', documentId],
        queryFn: () => driversApi.getDocumentViewUrl(documentId!),
        enabled: Boolean(documentId),
        staleTime: 0,
        gcTime: 0,
    });
};