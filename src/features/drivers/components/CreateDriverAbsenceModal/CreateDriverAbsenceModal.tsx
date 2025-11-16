// src/features/drivers/components/CreateDriverAbsenceModal/CreateDriverAbsenceModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { useCreateDriverAbsence } from '../../hooks/useDriverAbsences';
import { createDriverAbsenceSchema } from '../../lib/absenceValidation';
import { DriverAbsenceType } from '../../types';

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.625rem ${({ theme }) => theme.spacing.md};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[900]};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: all ${({ theme }) => theme.transitions.normal};
    outline: none;
    resize: vertical;
    min-height: 100px;
    font-family: inherit;

    &::placeholder {
        color: ${({ theme }) => theme.colors.slate[400]};
    }

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary[500]};
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
        background: ${({ theme }) => theme.colors.slate[50]};
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

const Label = styled.label`
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RequiredMark = styled.span`
    color: ${({ theme }) => theme.colors.danger[500]};
    margin-left: 2px;
`;

const ErrorMessage = styled.span`
    display: block;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.danger[600]};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.lg};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column-reverse;

        button {
            width: 100%;
        }
    }
`;

interface CreateDriverAbsenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    driverId: string;
}

export const CreateDriverAbsenceModal: React.FC<CreateDriverAbsenceModalProps> = ({
                                                                                      isOpen,
                                                                                      onClose,
                                                                                      driverId,
                                                                                  }) => {
    const createAbsence = useCreateDriverAbsence(driverId);
    const [formData, setFormData] = useState({
        type: 'VACATION' as DriverAbsenceType,
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const absenceTypeOptions = [
        { value: 'VACATION', label: 'Urlop' },
        { value: 'SICK_LEAVE', label: 'L4 / Zwolnienie lekarskie' },
        { value: 'PERSONAL_LEAVE', label: 'Urlop okolicznościowy' },
        { value: 'UNPAID_LEAVE', label: 'Urlop bezpłatny' },
        { value: 'OTHER', label: 'Inna nieobecność' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = createDriverAbsenceSchema.parse(formData);
            await createAbsence.mutateAsync(validatedData);
            handleClose();
        } catch (err: any) {
            if (err.errors) {
                const newErrors: Record<string, string> = {};
                err.errors.forEach((error: any) => {
                    const path = error.path.join('.');
                    newErrors[path] = error.message;
                });
                setErrors(newErrors);
            }
        }
    };

    const handleClose = () => {
        setFormData({
            type: 'VACATION',
            startDate: '',
            endDate: '',
            reason: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Zgłoś nieobecność kierowcy">
            <FormContainer onSubmit={handleSubmit}>
                <div>
                    <Label>
                        Typ nieobecności
                        <RequiredMark>*</RequiredMark>
                    </Label>
                    <Select
                        value={formData.type}
                        onChange={(e) => {
                            setFormData({ ...formData, type: e.target.value as DriverAbsenceType });
                            if (errors.type) setErrors({ ...errors, type: '' });
                        }}
                        options={absenceTypeOptions}
                        required
                        disabled={createAbsence.isPending}
                    />
                    {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
                </div>

                <FormRow>
                    <div>
                        <Label>
                            Data rozpoczęcia
                            <RequiredMark>*</RequiredMark>
                        </Label>
                        <Input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => {
                                setFormData({ ...formData, startDate: e.target.value });
                                if (errors.startDate) setErrors({ ...errors, startDate: '' });
                            }}
                            required
                            disabled={createAbsence.isPending}
                            error={errors.startDate}
                        />
                    </div>

                    <div>
                        <Label>
                            Data zakończenia
                            <RequiredMark>*</RequiredMark>
                        </Label>
                        <Input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => {
                                setFormData({ ...formData, endDate: e.target.value });
                                if (errors.endDate) setErrors({ ...errors, endDate: '' });
                            }}
                            required
                            disabled={createAbsence.isPending}
                            error={errors.endDate}
                        />
                    </div>
                </FormRow>

                <div>
                    <Label>Powód (opcjonalnie)</Label>
                    <TextArea
                        value={formData.reason}
                        onChange={(e) => {
                            setFormData({ ...formData, reason: e.target.value });
                            if (errors.reason) setErrors({ ...errors, reason: '' });
                        }}
                        placeholder="np. Urlop wypoczynkowy, zwolnienie lekarskie..."
                        maxLength={1000}
                        disabled={createAbsence.isPending}
                    />
                    {errors.reason && <ErrorMessage>{errors.reason}</ErrorMessage>}
                </div>

                <FormActions>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={createAbsence.isPending}
                    >
                        Anuluj
                    </Button>
                    <Button type="submit" isLoading={createAbsence.isPending}>
                        Zgłoś nieobecność
                    </Button>
                </FormActions>
            </FormContainer>
        </Modal>
    );
};