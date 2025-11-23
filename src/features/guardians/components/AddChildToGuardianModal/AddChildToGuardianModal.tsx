// src/features/guardians/components/AddChildToGuardianModal/AddChildToGuardianModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Plus } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { MultiSelect } from '@/shared/ui/MultiSelect';
import { disabilityOptions, relationshipOptions } from '@/features/children/lib/constants';
import { DisabilityType, GuardianRelationship } from '@/features/children/types';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const ModalTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.slate[500]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        color: ${({ theme }) => theme.colors.slate[900]};
    }
`;

const ModalBody = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
`;

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h3`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const CheckboxGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const CheckboxGroupTitle = styled.span`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.xl};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column-reverse;
        button {
            width: 100%;
        }
    }
`;

const HelpText = styled.p`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export interface AddChildFormData {
    firstName: string;
    lastName: string;
    birthDate: string;
    disability: DisabilityType[];
    transportNeeds: {
        wheelchair: boolean;
        specialSeat: boolean;
        safetyBelt: boolean;
    };
    notes?: string;
    relationship: GuardianRelationship;
    isPrimary: boolean;
}

interface AddChildToGuardianModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AddChildFormData) => Promise<void>;
    guardianName: string;
    isLoading?: boolean;
}

export const AddChildToGuardianModal: React.FC<AddChildToGuardianModalProps> = ({
                                                                                    isOpen,
                                                                                    onClose,
                                                                                    onSubmit,
                                                                                    guardianName,
                                                                                    isLoading = false,
                                                                                }) => {
    const [formData, setFormData] = useState<AddChildFormData>({
        firstName: '',
        lastName: '',
        birthDate: '',
        disability: [],
        transportNeeds: {
            wheelchair: false,
            specialSeat: false,
            safetyBelt: false,
        },
        notes: '',
        relationship: 'PARENT',
        isPrimary: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: any) => {
        if (field.startsWith('transportNeeds.')) {
            const needField = field.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                transportNeeds: {
                    ...prev.transportNeeds,
                    [needField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Imię jest wymagane';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Nazwisko jest wymagane';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = 'Data urodzenia jest wymagana';
        } else {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();
            if (birthDate >= today) {
                newErrors.birthDate = 'Data urodzenia musi być w przeszłości';
            }
        }

        if (formData.disability.length === 0) {
            newErrors.disability = 'Wybierz przynajmniej jedną niepełnosprawność';
        }

        if (!formData.relationship) {
            newErrors.relationship = 'Relacja jest wymagana';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                birthDate: '',
                disability: [],
                transportNeeds: {
                    wheelchair: false,
                    specialSeat: false,
                    safetyBelt: false,
                },
                notes: '',
                relationship: 'PARENT',
                isPrimary: false,
            });
            setErrors({});
        } catch (error) {
            console.error('Error adding child:', error);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                firstName: '',
                lastName: '',
                birthDate: '',
                disability: [],
                transportNeeds: {
                    wheelchair: false,
                    specialSeat: false,
                    safetyBelt: false,
                },
                notes: '',
                relationship: 'PARENT',
                isPrimary: false,
            });
            setErrors({});
            onClose();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>Dodaj dziecko dla {guardianName}</ModalTitle>
                    <CloseButton onClick={handleClose} disabled={isLoading}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <HelpText>
                            Wypełnij dane dziecka. Zostanie ono automatycznie przypisane do tego opiekuna.
                        </HelpText>

                        <FormContainer>
                            <FormSection>
                                <SectionTitle>Dane dziecka</SectionTitle>
                                <FormRow>
                                    <Input
                                        label="Imię"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                        error={errors.firstName}
                                        required
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                    <Input
                                        label="Nazwisko"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        error={errors.lastName}
                                        required
                                        disabled={isLoading}
                                    />
                                </FormRow>
                                <Input
                                    label="Data urodzenia"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => handleChange('birthDate', e.target.value)}
                                    error={errors.birthDate}
                                    required
                                    disabled={isLoading}
                                />
                            </FormSection>

                            <FormSection>
                                <MultiSelect
                                    label="Niepełnosprawność"
                                    options={disabilityOptions}
                                    value={formData.disability}
                                    onChange={(value) => handleChange('disability', value)}
                                    error={errors.disability}
                                    required
                                />
                            </FormSection>

                            <FormSection>
                                <SectionTitle>Potrzeby transportowe</SectionTitle>
                                <CheckboxGroup>
                                    <Checkbox
                                        label="Wózek inwalidzki"
                                        checked={formData.transportNeeds.wheelchair}
                                        onChange={(e) =>
                                            handleChange('transportNeeds.wheelchair', e.target.checked)
                                        }
                                        disabled={isLoading}
                                    />
                                    <Checkbox
                                        label="Specjalne siedzenie"
                                        checked={formData.transportNeeds.specialSeat}
                                        onChange={(e) =>
                                            handleChange('transportNeeds.specialSeat', e.target.checked)
                                        }
                                        disabled={isLoading}
                                    />
                                    <Checkbox
                                        label="Pas bezpieczeństwa"
                                        checked={formData.transportNeeds.safetyBelt}
                                        onChange={(e) =>
                                            handleChange('transportNeeds.safetyBelt', e.target.checked)
                                        }
                                        disabled={isLoading}
                                    />
                                </CheckboxGroup>
                            </FormSection>

                            <FormSection>
                                <SectionTitle>Relacja z opiekunem</SectionTitle>
                                <Select
                                    label="Relacja"
                                    value={formData.relationship}
                                    onChange={(e) =>
                                        handleChange('relationship', e.target.value as GuardianRelationship)
                                    }
                                    options={relationshipOptions}
                                    error={errors.relationship}
                                    required
                                    disabled={isLoading}
                                />
                                <Checkbox
                                    label="Ustaw jako opiekuna głównego"
                                    checked={formData.isPrimary}
                                    onChange={(e) => handleChange('isPrimary', e.target.checked)}
                                    disabled={isLoading}
                                />
                            </FormSection>

                            <FormSection>
                                <Input
                                    label="Notatki (opcjonalnie)"
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    error={errors.notes}
                                    disabled={isLoading}
                                />
                            </FormSection>
                        </FormContainer>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Anuluj
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            <Plus size={16} />
                            Dodaj dziecko
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContainer>
        </ModalOverlay>
    );
};