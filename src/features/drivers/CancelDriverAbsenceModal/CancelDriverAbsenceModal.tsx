// src/features/drivers/components/CancelDriverAbsenceModal/CancelDriverAbsenceModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import {DriverAbsence} from "@/features/drivers/types.ts";
import {useCancelDriverAbsence} from "@/features/drivers/hooks/useDriverAbsences.ts";
import {cancelDriverAbsenceSchema} from "@/features/drivers/lib/absenceValidation.ts";

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const WarningBox = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.warning[50]};
    border-left: 3px solid ${({ theme }) => theme.colors.warning[500]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: flex-start;
`;

const WarningContent = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    line-height: 1.5;
`;

const WarningTitle = styled.div`
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
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

interface CancelDriverAbsenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    absence: DriverAbsence | null;
    driverId: string;
}

export const CancelDriverAbsenceModal: React.FC<CancelDriverAbsenceModalProps> = ({
                                                                                      isOpen,
                                                                                      onClose,
                                                                                      absence,
                                                                                      driverId,
                                                                                  }) => {
    const cancelAbsence = useCancelDriverAbsence(driverId);
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const validatedData = cancelDriverAbsenceSchema.parse({ reason });

            if (absence) {
                await cancelAbsence.mutateAsync({
                    absenceId: absence.id,
                    data: validatedData,
                });
                handleClose();
            }
        } catch (err: any) {
            if (err.errors) {
                setError(err.errors[0]?.message || 'Nieprawidłowe dane');
            }
        }
    };

    const handleClose = () => {
        setReason('');
        setError('');
        onClose();
    };

    if (!absence) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Anuluj nieobecność">
            <FormContainer onSubmit={handleSubmit}>
                <WarningBox>
                    <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <WarningContent>
                        <WarningTitle>Uwaga!</WarningTitle>
                        Anulowanie nieobecności kierowcy może wymagać ponownego przypisania tras.
                        Upewnij się, że wszystkie trasy są odpowiednio zaktualizowane.
                    </WarningContent>
                </WarningBox>

                <div>
                    <Label>
                        Powód anulowania
                        <RequiredMark>*</RequiredMark>
                    </Label>
                    <TextArea
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="np. Kierowca wrócił do pracy wcześniej niż planowano..."
                        maxLength={1000}
                        required
                        disabled={cancelAbsence.isPending}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </div>

                <FormActions>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={cancelAbsence.isPending}
                    >
                        Anuluj
                    </Button>
                    <Button type="submit" variant="danger" isLoading={cancelAbsence.isPending}>
                        Potwierdź anulowanie
                    </Button>
                </FormActions>
            </FormContainer>
        </Modal>
    );
};