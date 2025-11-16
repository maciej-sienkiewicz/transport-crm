// src/features/drivers/components/StatusDocumentsTab/StatusDocumentsTab.tsx
import React, { useState, useRef } from 'react';
import { Check, X, AlertTriangle, FileText, Download, Trash2, Upload, Clock } from 'lucide-react';
import { useDriverDetail } from '../../hooks/useDriverDetail';
import { useCEPIKHistory } from '../../hooks/useCEPIKHistory';
import { useDriverDocuments, useUploadDocument, useDeleteDocument } from '../../hooks/useDriverDocuments';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Select } from '@/shared/ui/Select';
import { DriverDocument } from '../../types';
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
    TimelineContainer,
    TimelineItem,
    TimelineDot,
    TimelineContent,
    TimelineHeader,
    TimelineTitle,
    TimelineTime,
    TimelineText,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptyText,
    UploadArea,
    UploadInfo,
    UploadTitle,
    UploadText,
} from './StatusDocumentsTab.styles';

interface StatusDocumentsTabProps {
    driverId: string;
}

export const StatusDocumentsTab: React.FC<StatusDocumentsTabProps> = ({ driverId }) => {
    const { data: driver, isLoading: isLoadingDriver } = useDriverDetail(driverId);
    const { data: cepikHistory, isLoading: isLoadingCEPIK } = useCEPIKHistory(driverId);
    const { data: documents, isLoading: isLoadingDocs } = useDriverDocuments(driverId);
    const uploadDocument = useUploadDocument(driverId);
    const deleteDocument = useDeleteDocument(driverId);

    const [uploadType, setUploadType] = useState<DriverDocument['type']>('OTHER');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await uploadDocument.mutateAsync({ file, type: uploadType });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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

    const getCEPIKStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge variant="success">Aktywne</Badge>;
            case 'SUSPENDED':
                return <Badge variant="warning">Zawieszone</Badge>;
            case 'REVOKED':
                return <Badge variant="danger">Cofnięte</Badge>;
            default:
                return <Badge variant="default">{status}</Badge>;
        }
    };

    if (isLoadingDriver || !driver) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        );
    }

    const documentTypeOptions = [
        { value: 'CONTRACT', label: 'Umowa o pracę' },
        { value: 'AMENDMENT', label: 'Aneks' },
        { value: 'LICENSE_SCAN', label: 'Skan prawa jazdy' },
        { value: 'MEDICAL_SCAN', label: 'Skan badań lekarskich' },
        { value: 'LEAVE_REQUEST', label: 'Wniosek urlopowy' },
        { value: 'OTHER', label: 'Inny dokument' },
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
                            onChange={(e) => setUploadType(e.target.value as DriverDocument['type'])}
                            options={documentTypeOptions}
                            style={{ width: '200px' }}
                        />
                        <Button
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            isLoading={uploadDocument.isPending}
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
                        <EmptyText>Nie przesłano jeszcze żadnych dodatkowych dokumentów</EmptyText>
                    </EmptyState>
                ) : (
                    <DocumentsList>
                        {documents.map((doc) => (
                            <DocumentListItem key={doc.id}>
                                <DocumentListInfo>
                                    <DocumentListIcon>
                                        <FileText size={18} />
                                    </DocumentListIcon>
                                    <DocumentListDetails>
                                        <DocumentListName>{doc.name}</DocumentListName>
                                        <DocumentListMeta>
                                            {formatFileSize(doc.fileSize)} • {formatTimestamp(doc.uploadedAt)} • {doc.uploadedBy}
                                        </DocumentListMeta>
                                    </DocumentListDetails>
                                </DocumentListInfo>
                                <DocumentListActions>
                                    <IconButton onClick={() => window.open(doc.fileUrl, '_blank')} title="Pobierz">
                                        <Download size={16} />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(doc.id, doc.name)}
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

            <div>
                <SectionTitle>🔄 Historia sprawdzeń CEPIK (ostatnie 10)</SectionTitle>
                {isLoadingCEPIK ? (
                    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <LoadingSpinner />
                    </div>
                ) : !cepikHistory || cepikHistory.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>
                            <Clock size={32} />
                        </EmptyIcon>
                        <EmptyTitle>Brak historii</EmptyTitle>
                        <EmptyText>Nie wykonano jeszcze żadnych sprawdzeń w systemie CEPIK</EmptyText>
                    </EmptyState>
                ) : (
                    <TimelineContainer>
                        {cepikHistory.slice(0, 10).map((check) => (
                            <TimelineItem key={check.id}>
                                <TimelineDot
                                    $status={
                                        check.status === 'ACTIVE'
                                            ? 'success'
                                            : check.status === 'SUSPENDED'
                                                ? 'warning'
                                                : 'danger'
                                    }
                                />
                                <TimelineContent>
                                    <TimelineHeader>
                                        <TimelineTitle>
                                            {getCEPIKStatusBadge(check.status)}
                                        </TimelineTitle>
                                        <TimelineTime>{formatTimestamp(check.timestamp)}</TimelineTime>
                                    </TimelineHeader>
                                    <TimelineText>
                                        Sprawdzone przez: {check.checkedBy}
                                    </TimelineText>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </TimelineContainer>
                )}
            </div>
        </Container>
    );
};