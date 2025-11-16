// src/features/drivers/components/NotesTab/NotesTab.tsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Bell, Star, AlertTriangle, Info } from 'lucide-react';
import { useDriverNotes, useCreateNote, useUpdateNote, useDeleteNote } from '../../hooks/useDriverNotes';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { DriverNote } from '../../types';
import {
    Container,
    Header,
    Title,
    NotesList,
    NoteCard,
    NoteHeader,
    NoteHeaderLeft,
    NoteHeaderTop,
    NoteTime,
    NoteAuthor,
    NoteContent,
    NoteActions,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptyText,
    FormContainer,
    FormActions,
    TextArea,
    Label,
    RequiredMark,
} from './NotesTab.styles';

interface NotesTabProps {
    driverId: string;
}

export const NotesTab: React.FC<NotesTabProps> = ({ driverId }) => {
    const { data: notes, isLoading } = useDriverNotes(driverId);
    const createNote = useCreateNote(driverId);
    const updateNote = useUpdateNote(driverId);
    const deleteNote = useDeleteNote(driverId);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingNote, setEditingNote] = useState<DriverNote | null>(null);
    const [formData, setFormData] = useState({
        category: 'OTHER' as DriverNote['category'],
        content: '',
    });

    const categoryOptions = [
        { value: 'REMINDER', label: '🔔 Przypomnienie' },
        { value: 'PRAISE', label: '⭐ Pochwała' },
        { value: 'ISSUE', label: '⚠️ Problem' },
        { value: 'OTHER', label: '📝 Inne' },
    ];

    const getCategoryIcon = (category: DriverNote['category']) => {
        switch (category) {
            case 'REMINDER':
                return <Bell size={16} />;
            case 'PRAISE':
                return <Star size={16} />;
            case 'ISSUE':
                return <AlertTriangle size={16} />;
            default:
                return <Info size={16} />;
        }
    };

    const getCategoryBadge = (category: DriverNote['category']) => {
        const variants: Record<DriverNote['category'], 'primary' | 'success' | 'warning' | 'default'> = {
            REMINDER: 'primary',
            PRAISE: 'success',
            ISSUE: 'warning',
            OTHER: 'default',
        };

        const labels = {
            REMINDER: 'Przypomnienie',
            PRAISE: 'Pochwała',
            ISSUE: 'Problem',
            OTHER: 'Inne',
        };

        return (
            <Badge variant={variants[category]}>
                {getCategoryIcon(category)}
                {labels[category]}
            </Badge>
        );
    };

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await createNote.mutateAsync(formData);
        setShowCreateModal(false);
        setFormData({ category: 'OTHER', content: '' });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNote) return;
        await updateNote.mutateAsync({ noteId: editingNote.id, data: formData });
        setEditingNote(null);
        setFormData({ category: 'OTHER', content: '' });
    };

    const handleDelete = async (noteId: string) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę notatkę?')) {
            await deleteNote.mutateAsync(noteId);
        }
    };

    const handleEdit = (note: DriverNote) => {
        setEditingNote(note);
        setFormData({
            category: note.category,
            content: note.content,
        });
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditingNote(null);
        setFormData({ category: 'OTHER', content: '' });
    };

    if (isLoading) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <Container>
            <Header>
                <Title>📝 Notatki ({notes?.length || 0})</Title>
                <Button size="sm" onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} />
                    Dodaj notatkę
                </Button>
            </Header>

            {!notes || notes.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>
                        <FileText size={32} />
                    </EmptyIcon>
                    <EmptyTitle>Brak notatek</EmptyTitle>
                    <EmptyText>Nie dodano jeszcze żadnych notatek dla tego kierowcy</EmptyText>
                </EmptyState>
            ) : (
                <NotesList>
                    {notes.map((note) => (
                        <NoteCard key={note.id}>
                            <NoteHeader>
                                <NoteHeaderLeft>
                                    <NoteHeaderTop>
                                        <NoteTime>{formatTimestamp(note.createdAt)}</NoteTime>
                                        {getCategoryBadge(note.category)}
                                    </NoteHeaderTop>
                                    <NoteAuthor>
                                        {note.createdByName}
                                    </NoteAuthor>
                                </NoteHeaderLeft>
                            </NoteHeader>

                            <NoteContent>{note.content}</NoteContent>

                            <NoteActions>
                                <Button variant="secondary" size="sm" onClick={() => handleEdit(note)}>
                                    <Edit2 size={14} />
                                    Edytuj
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(note.id)}
                                    disabled={deleteNote.isPending}
                                >
                                    <Trash2 size={14} />
                                    Usuń
                                </Button>
                            </NoteActions>
                        </NoteCard>
                    ))}
                </NotesList>
            )}

            <Modal
                isOpen={showCreateModal || !!editingNote}
                onClose={handleCloseModal}
                title={editingNote ? 'Edytuj notatkę' : 'Dodaj notatkę'}
            >
                <FormContainer onSubmit={editingNote ? handleUpdate : handleCreate}>
                    <div>
                        <Label>
                            Kategoria
                            <RequiredMark>*</RequiredMark>
                        </Label>
                        <Select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as DriverNote['category'] })}
                            options={categoryOptions}
                            required
                        />
                    </div>

                    <div>
                        <Label>
                            Treść notatki
                            <RequiredMark>*</RequiredMark>
                        </Label>
                        <TextArea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Wpisz treść notatki..."
                            maxLength={2000}
                            required
                            disabled={createNote.isPending || updateNote.isPending}
                        />
                    </div>

                    <FormActions>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCloseModal}
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