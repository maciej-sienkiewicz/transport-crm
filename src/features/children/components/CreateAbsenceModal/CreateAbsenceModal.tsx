// src/features/children/components/CreateAbsenceModal/CreateAbsenceModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { useCreateAbsence } from '../../hooks/useCreateAbsence';
import { useSchedules } from '../../hooks/useSchedules';
import { createAbsenceSchema, CreateAbsenceFormData } from '../../lib/absenceValidation';
import { AbsenceType } from '@/shared/types/absence';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
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

const InfoBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary[50]};
  border-left: 3px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[700]};
  line-height: 1.5;
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
  min-height: 80px;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.slate[400]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.slate[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.danger[600]};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

interface CreateAbsenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    childId: string;
}

const typeOptions = [
    { value: '', label: 'Wybierz typ...' },
    { value: 'FULL_DAY', label: 'Cały dzień' },
    { value: 'SPECIFIC_SCHEDULE', label: 'Specyficzny harmonogram' },
];

export const CreateAbsenceModal: React.FC<CreateAbsenceModalProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          childId,
                                                                      }) => {
    const createAbsence = useCreateAbsence(childId);
    const { data: schedulesData } = useSchedules(childId);

    const [formData, setFormData] = useState<CreateAbsenceFormData>({
        type: 'FULL_DAY' as AbsenceType,
        startDate: '',
        endDate: '',
        scheduleId: null,
        reason: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const schedules = schedulesData?.schedules || [];
    const scheduleOptions = [
        { value: '', label: 'Wybierz harmonogram...' },
        ...schedules
            .filter((s) => s.active)
            .map((s) => ({
                value: s.id,
                label: s.name,
            })),
    ];

    const handleChange = (field: keyof CreateAbsenceFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleTypeChange = (type: string) => {
        setFormData((prev) => ({
            ...prev,
            type: type as AbsenceType,
            scheduleId: type === 'FULL_DAY' ? null : prev.scheduleId,
        }));

        if (errors.type || errors.scheduleId) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.type;
                delete newErrors.scheduleId;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = createAbsenceSchema.parse(formData);
            await createAbsence.mutateAsync(validatedData);
            handleClose();
        } catch (error: any) {
            if (error.errors) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    const path = err.path.join('.');
                    newErrors[path] = err.message;
                });
                setErrors(newErrors);
            }
        }
    };

    const handleClose = () => {
        setFormData({
            type: 'FULL_DAY',
            startDate: '',
            endDate: '',
            scheduleId: null,
            reason: '',
        });
        setErrors({});
        onClose();
    };

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Zgłoś nieobecność">
            <FormContainer onSubmit={handleSubmit}>
                <InfoBox>
                    💡 <strong>Ważne:</strong> Nieobecność całodniowa dotyczy wszystkich harmonogramów
                    dziecka. Nieobecność specyficzna dotyczy tylko wybranego harmonogramu.
                </InfoBox>

                <Select
                    label="Typ nieobecności"
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    options={typeOptions}
                    required
                    error={errors.type}
                />

                <FormRow>
                    <Input
                        label="Data rozpoczęcia"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        min={getTodayDate()}
                        required
                        error={errors.startDate}
                    />
                    <Input
                        label="Data zakończenia"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        min={formData.startDate || getTodayDate()}
                        required
                        error={errors.endDate}
                    />
                </FormRow>

                {formData.type === 'SPECIFIC_SCHEDULE' && (
                    <Select
                        label="Harmonogram"
                        value={formData.scheduleId || ''}
                        onChange={(e) => handleChange('scheduleId', e.target.value || null)}
                        options={scheduleOptions}
                        required
                        error={errors.scheduleId}
                    />
                )}

                <div>
                    <Label>Powód (opcjonalnie)</Label>
                    <TextArea
                        value={formData.reason || ''}
                        onChange={(e) => handleChange('reason', e.target.value)}
                        placeholder="np. Wizyta lekarska, choroba, wyjazd rodzinny..."
                        maxLength={1000}
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