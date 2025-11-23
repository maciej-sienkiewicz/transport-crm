// src/features/guardians/components/GuardianDocuments/GuardianDocuments.tsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FileText, Trash2, Upload, Eye } from 'lucide-react';
import {
    useGuardianDocuments,
    useUploadGuardianDocument,
    useDeleteGuardianDocument,
    useGuardianDocumentViewUrl,
} from '../../hooks/useGuardianDocuments';
import { GuardianDocumentType } from '../../types';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Select } from '@/shared/ui/Select';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const UploadArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border: 2px dashed ${({ theme }) => theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary[400]};
        background: ${({ theme }) => theme.colors.primary[50]};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const UploadInfo = styled.div`
    flex: 1;
`;

const UploadTitle = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UploadText = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const UploadControls = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        flex-direction: column;
    }
`;

const DocumentsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const DocumentItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.md};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[50]};
        border-color: ${({ theme }) => theme.colors.primary[200]};
    }
`;

const DocumentInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    flex: 1;
    min-width: 0;
`;

const DocumentIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[600]};
    flex-shrink: 0;
`;

const DocumentDetails = styled.div`
    flex: 1;
    min-width: 0;
`;

const DocumentName = styled.div`
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const DocumentMeta = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
`;

const DocumentActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const IconButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.slate[600]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        color: ${({ theme }) => theme.colors.slate[900]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

const EmptyIcon = styled.div`
    width: 64px;
    height: 64px;
    margin: 0 auto ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

interface GuardianDocumentsProps {
    guardianId: string;
}

const documentTypeLabels: Record<GuardianDocumentType, string> = {
    GUARDIAN_ID_SCAN: 'Skan dowodu',
    GUARDIAN_AUTHORIZATION: 'Upoważnienie',
    GUARDIAN_CONTRACT: 'Umowa',
    GUARDIAN_PAYMENT_CONFIRMATION: 'Potwierdzenie płatności',
    GUARDIAN_OTHER: 'Inny dokument',
};

export const GuardianDocuments: React.FC<GuardianDocumentsProps> = ({ guardianId }) => {
    const [uploadType, setUploadType] = useState<GuardianDocumentType>('GUARDIAN_OTHER');
    const [viewingDocId, setViewingDocId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: documents, isLoading } = useGuardianDocuments(guardianId);
    const uploadDocument = useUploadGuardianDocument(guardianId);
    const deleteDocument = useDeleteGuardianDocument();
    const { data: viewUrlData } = useGuardianDocumentViewUrl(viewingDocId);

    React.useEffect(() => {
        if (viewUrlData?.viewUrl && viewingDocId) {
            window.open(viewUrlData.viewUrl, '_blank');
            setViewingDocId(null);
        }
    }, [viewUrlData, viewingDocId]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Plik jest za duży. Maksymalny rozmiar to 10 MB');
            return;
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Nieobsługiwany format pliku. Dozwolone: PDF, JPG, PNG');
            return;
        }

        await uploadDocument.mutateAsync({
            file,
            documentType: uploadType,
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
        return new Date(timestamp).toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDocumentTypeBadge = (type: GuardianDocumentType) => {
        const colorMap: Record<GuardianDocumentType, 'primary' | 'success' | 'warning' | 'default'> = {
            GUARDIAN_ID_SCAN: 'success',
            GUARDIAN_AUTHORIZATION: 'primary',
            GUARDIAN_CONTRACT: 'primary',
            GUARDIAN_PAYMENT_CONFIRMATION: 'warning',
            GUARDIAN_OTHER: 'default',
        };

        return (
            <Badge variant={colorMap[type]}>
                {documentTypeLabels[type]}
            </Badge>
        );
    };

    const documentTypeOptions = Object.entries(documentTypeLabels).map(([value, label]) => ({
        value,
        label,
    }));

    if (isLoading) {
        return (
            <Container>
                <LoadingSpinner />
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <h2>Dokumenty ({documents?.length || 0})</h2>
            </Header>

            <UploadArea>
                <UploadInfo>
                    <UploadTitle>Prześlij nowy dokument</UploadTitle>
                    <UploadText>PDF, JPG, PNG - maksymalnie 10 MB</UploadText>
                </UploadInfo>
                <UploadControls>
                    <Select
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value as GuardianDocumentType)}
                        options={documentTypeOptions}
                        style={{ minWidth: '250px' }}
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
                </UploadControls>
            </UploadArea>

            {!documents || documents.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>
                        <FileText size={32} />
                    </EmptyIcon>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>
                        Brak dokumentów. Prześlij pierwszy dokument.
                    </p>
                </EmptyState>
            ) : (
                <DocumentsList>
                    {documents.map((doc) => (
                        <DocumentItem key={doc.id}>
                            <DocumentInfo>
                                <DocumentIcon>
                                    <FileText size={18} />
                                </DocumentIcon>
                                <DocumentDetails>
                                    <DocumentName>{doc.fileName}</DocumentName>
                                    <DocumentMeta>
                                        {getDocumentTypeBadge(doc.documentType)}
                                        <span>•</span>
                                        <span>{formatFileSize(doc.fileSize)}</span>
                                        <span>•</span>
                                        <span>{formatTimestamp(doc.uploadedAt)}</span>
                                        <span>•</span>
                                        <span>{doc.uploadedByName}</span>
                                    </DocumentMeta>
                                    {doc.notes && (
                                        <DocumentMeta style={{ marginTop: '0.25rem' }}>
                                            📝 {doc.notes}
                                        </DocumentMeta>
                                    )}
                                </DocumentDetails>
                            </DocumentInfo>
                            <DocumentActions>
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
                            </DocumentActions>
                        </DocumentItem>
                    ))}
                </DocumentsList>
            )}
        </Container>
    );
};