// src/features/guardians/components/GuardianContactHistory/GuardianContactHistory.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Phone, Mail, User, Trash2, Clock } from 'lucide-react';
import { useContactHistory, useCreateContactHistory, useDeleteContactHistory } from '../../hooks/useContactHistory';
import { ContactType, CreateContactHistoryRequest } from '../../types';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { Input } from '@/shared/ui/Input';
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

const Timeline = styled.div`
    position: relative;
    padding-left: ${({ theme }) => theme.spacing.xl};

    &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(
            to bottom,
            ${({ theme }) => theme.colors.slate[200]},
            ${({ theme }) => theme.colors.slate[100]}
        );
    }
`;

const TimelineItem = styled.div`
    position: relative;
    padding-bottom: ${({ theme }) => theme.spacing.xl};

    &:last-child {
        padding-bottom: 0;
    }
`;

const TimelineDot = styled.div<{ $color: string }>`
    position: absolute;
    left: -30px;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    border: 3px solid white;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.slate[200]};
`;

const ContactCard = styled.div`
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

const ContactHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ContactTitle = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ContactMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const ContactNotes = styled.div`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    line-height: 1.6;
    white-space: pre-wrap;
`;

const DeleteButton = styled.button`
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

interface GuardianContactHistoryProps {
    guardianId: string;
}

const contactTypeLabels: Record<ContactType, string> = {
    PHONE_CALL: 'Rozmowa telefoniczna',
    EMAIL: 'Email',
    IN_PERSON: 'Spotkanie osobiste',
    OTHER: 'Inny',
};

const contactTypeIcons: Record<ContactType, React.ReactNode> = {
    PHONE_CALL: <Phone size={14} />,
    EMAIL: <Mail size={14} />,
    IN_PERSON: <User size={14} />,
    OTHER: <Clock size={14} />,
};

const contactTypeColors: Record<ContactType, string> = {
    PHONE_CALL: '#3b82f6',
    EMAIL: '#8b5cf6',
    IN_PERSON: '#10b981',
    OTHER: '#64748b',
};

export const GuardianContactHistory: React.FC<GuardianContactHistoryProps> = ({ guardianId }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<CreateContactHistoryRequest>({
        type: 'PHONE_CALL',
        subject: '',
        notes: '',
    });

    const { data: contacts, isLoading } = useContactHistory(guardianId);
    const createContact = useCreateContactHistory(guardianId);
    const deleteContact = useDeleteContactHistory(guardianId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createContact.mutateAsync(formData);
        setShowModal(false);
        setFormData({
            type: 'PHONE_CALL',
            subject: '',
            notes: '',
        });
    };

    const handleDelete = async (contactId: string, subject: string) => {
        if (window.confirm(`Czy na pewno chcesz usunąć kontakt "${subject}"?`)) {
            await deleteContact.mutateAsync(contactId);
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

    const contactTypeOptions = Object.entries(contactTypeLabels).map(([value, label]) => ({
        value,
        label,
    }));

    return (
        <Container>
            <Header>
                <h2>Historia kontaktów ({contacts?.length || 0})</h2>
                <Button size="sm" onClick={() => setShowModal(true)}>
                    <Plus size={16} />
                    Dodaj kontakt
                </Button>
            </Header>

            {!contacts || contacts.length === 0 ? (
                <EmptyState>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>
                        Brak historii kontaktów. Dodaj pierwszy wpis po rozmowie z opiekunem.
                    </p>
                </EmptyState>
            ) : (
                <Timeline>
                    {contacts.map((contact) => (
                        <TimelineItem key={contact.id}>
                            <TimelineDot $color={contactTypeColors[contact.type]} />
                            <ContactCard>
                                <ContactHeader>
                                    <div style={{ flex: 1 }}>
                                        <ContactTitle>{contact.subject}</ContactTitle>
                                        <ContactMeta>
                                            <MetaItem>
                                                <Badge variant="default">
                                                    {contactTypeIcons[contact.type]}
                                                    {contactTypeLabels[contact.type]}
                                                </Badge>
                                            </MetaItem>
                                            <MetaItem>
                                                <Clock size={14} />
                                                {formatTimestamp(contact.contactedAt)}
                                            </MetaItem>
                                            <MetaItem>
                                                <User size={14} />
                                                {contact.handledByName}
                                            </MetaItem>
                                        </ContactMeta>
                                    </div>
                                    <DeleteButton
                                        onClick={() => handleDelete(contact.id, contact.subject)}
                                        title="Usuń"
                                    >
                                        <Trash2 size={16} />
                                    </DeleteButton>
                                </ContactHeader>
                                <ContactNotes>{contact.notes}</ContactNotes>
                            </ContactCard>
                        </TimelineItem>
                    ))}
                </Timeline>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Dodaj kontakt"
            >
                <FormContainer onSubmit={handleSubmit}>
                    <Select
                        label="Typ kontaktu"
                        value={formData.type}
                        onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value as ContactType })
                        }
                        options={contactTypeOptions}
                        required
                    />

                    <Input
                        label="Temat"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Np. Pytanie o harmonogram, zgłoszenie nieobecności..."
                        required
                    />

                    <Textarea
                        label="Notatki"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Opisz przebieg rozmowy i podjęte działania..."
                        rows={6}
                        required
                    />

                    <FormActions>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                            disabled={createContact.isPending}
                        >
                            Anuluj
                        </Button>
                        <Button type="submit" isLoading={createContact.isPending}>
                            Zapisz kontakt
                        </Button>
                    </FormActions>
                </FormContainer>
            </Modal>
        </Container>
    );
};