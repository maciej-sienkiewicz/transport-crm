// src/features/guardians/components/GuardianNotes/GuardianNotes.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import {
    useGuardianNotes,
    useCreateGuardianNote,
    useUpdateGuardianNote,
    useDeleteGuardianNote,
} from '../../hooks/useGuardianNotes';
import { GuardianNote, GuardianNoteCategory, CreateGuardianNoteRequest } from '../../types';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Badge } from '@/shared/ui/Badge';

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

const NotesGrid = styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};
`;

const NoteCard = styled.div`
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
        border-color: ${({ theme }) => theme.colors.primary[200]};
    }
`;

const NoteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoteHeaderLeft = styled.div`
    flex: 1;
`;

const NoteMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

const NoteContent = styled.div`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    line-height: 1.6;
    white-space: pre-wrap;
`;

const NoteActions = styled.div`
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

    &.danger:hover {
        background: ${({ theme }) => theme.colors.danger[50]};
        color: ${({ theme }) => theme.colors.danger[600]};
    }
`;

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column-reverse;
        button {
            width: 100%;
        }
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

interface GuardianNotesProps {
    guardianId: string;
}

const noteCategoryLabels: Record<GuardianNoteCategory, string> = {
    GENERAL: 'Ogólna',
    COMPLAINT: 'Skarga',
    PRAISE: 'Pochwała',
    PAYMENT: 'Płatność',
    URGENT: 'Pilne',
};

const noteCategoryColors: Record<GuardianNoteCategory, 'default' | 'danger' | 'success' | 'warning' | 'primary'> = {
    GENERAL: 'default',
    COMPLAINT: 'danger',
    PRAISE: 'success',
    PAYMENT: 'warning',
    URGENT: 'danger',
};

export const GuardianNotes: React.FC<GuardianNotesProps> = ({ guardianId }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState<GuardianNote | null>(null);
    const [formData, setFormData] = useState<CreateGuardianNoteRequest>({
        category: 'GENERAL',
        content: '',
    });

    const { data: notes, isLoading } = useGuardianNotes(guardianId);
    const createNote = useCreateGuardianNote(guardianId);
    const updateNote = useUpdateGuardianNote(guardianId);
    const deleteNote = useDeleteGuardianNote(guardianId);

    const handleOpenCreate = () => {
        setEditingNote(null);
        setFormData({ category: 'GENERAL', content: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (note: GuardianNote) => {
        setEditingNote(note);
        setFormData({ category: note.category, content: note.content });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingNote) {
            await updateNote.mutateAsync({ noteId: editingNote.id, data: formData });
        } else {
            await createNote.mutateAsync(formData);
        }

        setShowModal(false);
        setEditingNote(null);
        setFormData({ category: 'GENERAL', content: '' });
    };

    const handleDelete = async (noteId: string) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę notatkę?')) {
            await deleteNote.mutateAsync(noteId);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const categoryOptions = Object.entries(noteCategoryLabels).map(([value, label]) => ({
        value,
        label,
    }));

    return (
        <Container>
            <Header>
                <h2>Notatki ({notes?.length || 0})</h2>
                <Button size="sm" onClick={handleOpenCreate}>
                    <Plus size={16} />
                    Dodaj notatkę
                </Button>
            </Header>

            {!notes || notes.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>
                        <FileText size={32} />
                    </EmptyIcon>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>
                        Brak notatek. Dodaj pierwszą notatkę o tym opiekunie.
                    </p>
                </EmptyState>
            ) : (
                <NotesGrid>
                    {notes.map((note) => (
                        <NoteCard key={note.id}>
                            <NoteHeader>
                                <NoteHeaderLeft>
                                    <Badge variant={noteCategoryColors[note.category]}>
                                        {noteCategoryLabels[note.category]}
                                    </Badge>
                                    <NoteMeta>
                                        {note.createdByName} • {formatTimestamp(note.createdAt)}
                                    </NoteMeta>
                                </NoteHeaderLeft>
                                <NoteActions>
                                    <IconButton onClick={() => handleOpenEdit(note)} title="Edytuj">
                                        <Edit2 size={16} />
                                    </IconButton>
                                    <IconButton
                                        className="danger"
                                        onClick={() => handleDelete(note.id)}
                                        title="Usuń"
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </NoteActions>
                            </NoteHeader>
                            <NoteContent>{note.content}</NoteContent>
                        </NoteCard>
                    ))}
                </NotesGrid>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingNote ? 'Edytuj notatkę' : 'Dodaj notatkę'}
            >
                <FormContainer onSubmit={handleSubmit}>
                    <Select
                        label="Kategoria"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                category: e.target.value as GuardianNoteCategory,
                            })
                        }
                        options={categoryOptions}
                        required
                    />

                    <Textarea
                        label="Treść notatki"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Wpisz notatkę..."
                        rows={6}
                        required
                    />

                    <FormActions>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                            disabled={createNote.isPending || updateNote.isPending}
                        >
                            Anuluj
                        </Button>
                        <Button
                            type="submit"
                            isLoading={createNote.isPending || updateNote.isPending}
                        >
                            {editingNote ? 'Zapisz zmiany' : 'Dodaj notatkę'}
                        </Button>
                    </FormActions>
                </FormContainer>
            </Modal>
        </Container>
    );
};