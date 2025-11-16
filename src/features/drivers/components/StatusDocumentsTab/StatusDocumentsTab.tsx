// src/features/drivers/components/StatusDocumentsTab/StatusDocumentsTab.tsx

import React, { useState, useRef } from 'react';
import { FileText, Trash2, Upload, Eye } from 'lucide-react';
import { useDriverDetail } from '../../hooks/useDriverDetail';
import { useDriverDocuments, useUploadDocument, useDeleteDocument, useDocumentViewUrl } from '../../hooks/useDriverDocuments';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Select } from '@/shared/ui/Select';
import { DocumentType } from '../../types';
import {
    Container,
    SectionTitle,
    DocumentsList,
    DocumentListItem,
    DocumentListInfo,
    DocumentListIcon,
    DocumentListDetails,
    DocumentListName,
    DocumentListMeta,
    DocumentListActions,
    IconButton,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptyText,
    UploadArea,
    UploadInfo,
    UploadTitle,
    UploadText,
} from './StatusDocumentsTab.styles';
import toast from "react-hot-toast";

interface StatusDocumentsTabProps {
    driverId: string;
}

export const StatusDocumentsTab: React.FC<StatusDocumentsTabProps> = ({ driverId }) => {
    const { data: driver, isLoading: isLoadingDriver } = useDriverDetail(driverId);
    const { data: documents, isLoading: isLoadingDocs } = useDriverDocuments(driverId);
    const uploadDocument = useUploadDocument(driverId);
    const deleteDocument = useDeleteDocument();

    const [uploadType, setUploadType] = useState<DocumentType>('DRIVER_OTHER');
    const [viewingDocId, setViewingDocId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: viewUrlData } = useDocumentViewUrl(viewingDocId);

    // Automatycznie otwórz dokument gdy URL jest gotowy
    React.useEffect(() => {
        if (viewUrlData?.viewUrl && viewingDocId) {
            window.open(viewUrlData.viewUrl, '_blank');
            setViewingDocId(null); // Reset
        }
    }, [viewUrlData, viewingDocId]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Walidacja rozmiaru
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Plik jest za duży. Maksymalny rozmiar to 10 MB');
            return;
        }

        // Walidacja typu
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Nieobsługiwany format pliku. Dozwolone: PDF, JPG, PNG');
            return;
        }

        await uploadDocument.mutateAsync({
            file,
            documentType: uploadType
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleView = (docId: string) => {
        setViewingDocId(docId);
    };

    const handleDelete = async (docId: string, docName: string) => {
        if (window.confirm(`Czy na pewno chcesz usunąć dokument "${docName}"?`)) {
            await deleteDocument.mutateAsync(docId);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDocumentTypeBadge = (type: DocumentType) => {
        const labels: Record<DocumentType, { label: string; color: string }> = {
            DRIVER_CONTRACT: { label: 'Umowa', color: 'primary' },
            DRIVER_CONTRACT_AMENDMENT: { label: 'Aneks', color: 'primary' },
            DRIVER_LICENSE_SCAN: { label: 'Prawo jazdy', color: 'success' },
            DRIVER_ID_SCAN: { label: 'Dowód osobisty', color: 'success' },
            DRIVER_MEDICAL_CERTIFICATE: { label: 'Badania', color: 'warning' },
            DRIVER_LEAVE_REQUEST: { label: 'Wniosek', color: 'default' },
            DRIVER_OTHER: { label: 'Inny', color: 'default' },
        };

        const { label, color } = labels[type];
        return <Badge variant={color as any}>{label}</Badge>;
    };

    if (isLoadingDriver || !driver) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        );
    }

    const documentTypeOptions = [
        { value: 'DRIVER_CONTRACT', label: 'Umowa o pracę' },
        { value: 'DRIVER_CONTRACT_AMENDMENT', label: 'Aneks do umowy' },
        { value: 'DRIVER_LICENSE_SCAN', label: 'Skan prawa jazdy' },
        { value: 'DRIVER_ID_SCAN', label: 'Skan dowodu osobistego' },
        { value: 'DRIVER_MEDICAL_CERTIFICATE', label: 'Badania lekarskie' },
        { value: 'DRIVER_LEAVE_REQUEST', label: 'Wniosek urlopowy' },
        { value: 'DRIVER_OTHER', label: 'Inny dokument' },
    ];

    return (
        <Container>
            <div>
                <SectionTitle>📁 Wszystkie dokumenty ({documents?.length || 0})</SectionTitle>

                <UploadArea>
                    <UploadInfo>
                        <UploadTitle>Prześlij nowy dokument</UploadTitle>
                        <UploadText>PDF, JPG, PNG - maksymalnie 10 MB</UploadText>
                    </UploadInfo>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Select
                            value={uploadType}
                            onChange={(e) => setUploadType(e.target.value as DocumentType)}
                            options={documentTypeOptions}
                            style={{ width: '250px' }}
                        />
                        <Button
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            isLoading={uploadDocument.isPending}
                            disabled={uploadDocument.isPending}
                        >
                            <Upload size={16} />
                            Wybierz plik
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                    </div>
                </UploadArea>

                {isLoadingDocs ? (
                    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <LoadingSpinner />
                    </div>
                ) : !documents || documents.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>
                            <FileText size={32} />
                        </EmptyIcon>
                        <EmptyTitle>Brak dokumentów</EmptyTitle>
                        <EmptyText>Nie przesłano jeszcze żadnych dokumentów</EmptyText>
                    </EmptyState>
                ) : (
                    <DocumentsList>
                        {documents.map((doc) => (
                            <DocumentListItem key={doc.id}>
                                <DocumentListInfo>
                                    <DocumentListIcon $isPdf={doc.isPdf} $isImage={doc.isImage}>
                                        <FileText size={18} />
                                    </DocumentListIcon>
                                    <DocumentListDetails>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <DocumentListName>{doc.fileName}</DocumentListName>
                                            {getDocumentTypeBadge(doc.documentType)}
                                        </div>
                                        <DocumentListMeta>
                                            {formatFileSize(doc.fileSize)} • {formatTimestamp(doc.uploadedAt)} • {doc.uploadedByName}
                                        </DocumentListMeta>
                                        {doc.notes && (
                                            <DocumentListMeta style={{ marginTop: '0.25rem' }}>
                                                📝 {doc.notes}
                                            </DocumentListMeta>
                                        )}
                                    </DocumentListDetails>
                                </DocumentListInfo>
                                <DocumentListActions>
                                    <IconButton
                                        onClick={() => handleView(doc.id)}
                                        title="Podgląd"
                                        disabled={viewingDocId === doc.id}
                                    >
                                        <Eye size={16} />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(doc.id, doc.fileName)}
                                        title="Usuń"
                                        disabled={deleteDocument.isPending}
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </DocumentListActions>
                            </DocumentListItem>
                        ))}
                    </DocumentsList>
                )}
            </div>
        </Container>
    );
};