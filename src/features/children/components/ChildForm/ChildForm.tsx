import React, { useState } from 'react';
import { createChildFormSchema, CreateChildFormData, updateChildFormSchema, UpdateChildFormData } from '../../lib/validation';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { MultiSelect } from '@/shared/ui/MultiSelect';
import { disabilityOptions, statusOptions, relationshipOptions } from '../../lib/constants';
import {
    FormContainer,
    FormSection,
    SectionTitle,
    FormRow,
    FormColumn,
    CheckboxGroup,
    FormActions,
    GuardianToggle,
    ToggleButton,
} from './ChildForm.styles';

interface ChildFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<CreateChildFormData | UpdateChildFormData>;
    guardianOptions?: Array<{ value: string; label: string }>;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ChildForm: React.FC<ChildFormProps> = ({
                                                        mode,
                                                        initialData,
                                                        guardianOptions = [],
                                                        onSubmit,
                                                        onCancel,
                                                        isLoading = false,
                                                    }) => {
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState<any>(initialData || {
        child: {
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
        },
        ...(mode === 'create' && {
            guardian: {
                existingId: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                relationship: '',
            },
        }),
        ...(mode === 'edit' && {
            status: 'ACTIVE',
        }),
    });

    const [useExistingGuardian, setUseExistingGuardian] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (path: string, value: any) => {
        const keys = path.split('.');
        setFormData((prev: any) => {
            const newData = { ...prev };
            let current = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newData;
        });

        if (errors[path]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[path];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const schema = isEditMode ? updateChildFormSchema : createChildFormSchema;

            let dataToValidate = { ...formData };

            if (!isEditMode && formData.guardian) {
                if (useExistingGuardian) {
                    dataToValidate.guardian = {
                        existingId: formData.guardian.existingId,
                    };
                } else {
                    const { existingId, ...newGuardianData } = formData.guardian;
                    dataToValidate.guardian = newGuardianData;
                }
            }

            const validatedData = schema.parse(dataToValidate);
            await onSubmit(validatedData);
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

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormSection>
                <SectionTitle>Dane dziecka</SectionTitle>
                <FormRow>
                    <Input
                        label="Imię"
                        value={isEditMode ? formData.firstName : formData.child?.firstName}
                        onChange={(e) => handleChange(isEditMode ? 'firstName' : 'child.firstName', e.target.value)}
                        error={errors[isEditMode ? 'firstName' : 'child.firstName']}
                        required
                    />
                    <Input
                        label="Nazwisko"
                        value={isEditMode ? formData.lastName : formData.child?.lastName}
                        onChange={(e) => handleChange(isEditMode ? 'lastName' : 'child.lastName', e.target.value)}
                        error={errors[isEditMode ? 'lastName' : 'child.lastName']}
                        required
                    />
                </FormRow>
                <FormRow>
                    <Input
                        label="Data urodzenia"
                        type="date"
                        value={isEditMode ? formData.birthDate : formData.child?.birthDate}
                        onChange={(e) => handleChange(isEditMode ? 'birthDate' : 'child.birthDate', e.target.value)}
                        error={errors[isEditMode ? 'birthDate' : 'child.birthDate']}
                        required
                    />
                    {isEditMode && (
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            options={statusOptions}
                            required
                        />
                    )}
                </FormRow>
            </FormSection>

            <FormSection>
                <MultiSelect
                    label="Niepełnosprawność"
                    required
                    options={disabilityOptions}
                    value={isEditMode ? formData.disability : formData.child?.disability || []}
                    onChange={(value) => handleChange(isEditMode ? 'disability' : 'child.disability', value)}
                    error={errors[isEditMode ? 'disability' : 'child.disability']}
                />
            </FormSection>

            <FormSection>
                <SectionTitle>Potrzeby transportowe</SectionTitle>
                <CheckboxGroup>
                    <Checkbox
                        label="Wózek inwalidzki"
                        checked={isEditMode ? formData.transportNeeds?.wheelchair : formData.child?.transportNeeds?.wheelchair}
                        onChange={(e) => handleChange(isEditMode ? 'transportNeeds.wheelchair' : 'child.transportNeeds.wheelchair', e.target.checked)}
                    />
                    <Checkbox
                        label="Specjalne siedzenie"
                        checked={isEditMode ? formData.transportNeeds?.specialSeat : formData.child?.transportNeeds?.specialSeat}
                        onChange={(e) => handleChange(isEditMode ? 'transportNeeds.specialSeat' : 'child.transportNeeds.specialSeat', e.target.checked)}
                    />
                    <Checkbox
                        label="Pas bezpieczeństwa"
                        checked={isEditMode ? formData.transportNeeds?.safetyBelt : formData.child?.transportNeeds?.safetyBelt}
                        onChange={(e) => handleChange(isEditMode ? 'transportNeeds.safetyBelt' : 'child.transportNeeds.safetyBelt', e.target.checked)}
                    />
                </CheckboxGroup>
            </FormSection>

            <FormSection>
                <Input
                    label="Notatki"
                    value={isEditMode ? formData.notes : formData.child?.notes}
                    onChange={(e) => handleChange(isEditMode ? 'notes' : 'child.notes', e.target.value)}
                    error={errors[isEditMode ? 'notes' : 'child.notes']}
                />
            </FormSection>

            {!isEditMode && (
                <FormSection>
                    <SectionTitle>Opiekun</SectionTitle>
                    <GuardianToggle>
                        <ToggleButton
                            type="button"
                            $active={useExistingGuardian}
                            onClick={() => {
                                setUseExistingGuardian(true);
                                setFormData((prev: any) => ({
                                    ...prev,
                                    guardian: {
                                        existingId: '',
                                        firstName: '',
                                        lastName: '',
                                        email: '',
                                        phone: '',
                                        relationship: '',
                                    },
                                }));
                            }}
                        >
                            Wybierz istniejącego
                        </ToggleButton>
                        <ToggleButton
                            type="button"
                            $active={!useExistingGuardian}
                            onClick={() => {
                                setUseExistingGuardian(false);
                                setFormData((prev: any) => ({
                                    ...prev,
                                    guardian: {
                                        existingId: '',
                                        firstName: '',
                                        lastName: '',
                                        email: '',
                                        phone: '',
                                        relationship: '',
                                    },
                                }));
                            }}
                        >
                            Dodaj nowego
                        </ToggleButton>
                    </GuardianToggle>

                    {useExistingGuardian ? (
                        <Select
                            label="Wybierz opiekuna"
                            value={formData.guardian?.existingId || ''}
                            onChange={(e) => handleChange('guardian.existingId', e.target.value)}
                            options={guardianOptions}
                            error={errors['guardian.existingId'] || errors['guardian']}
                            required
                        />
                    ) : (
                        <FormColumn>
                            <FormRow>
                                <Input
                                    label="Imię opiekuna"
                                    value={formData.guardian?.firstName || ''}
                                    onChange={(e) => handleChange('guardian.firstName', e.target.value)}
                                    error={errors['guardian.firstName']}
                                    required
                                />
                                <Input
                                    label="Nazwisko opiekuna"
                                    value={formData.guardian?.lastName || ''}
                                    onChange={(e) => handleChange('guardian.lastName', e.target.value)}
                                    error={errors['guardian.lastName']}
                                    required
                                />
                            </FormRow>
                            <FormRow>
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.guardian?.email || ''}
                                    onChange={(e) => handleChange('guardian.email', e.target.value)}
                                    error={errors['guardian.email']}
                                    required
                                />
                                <Input
                                    label="Telefon"
                                    type="tel"
                                    value={formData.guardian?.phone || ''}
                                    onChange={(e) => handleChange('guardian.phone', e.target.value)}
                                    error={errors['guardian.phone']}
                                    placeholder="+48123456789"
                                    required
                                />
                            </FormRow>
                            <Select
                                label="Relacja"
                                value={formData.guardian?.relationship || ''}
                                onChange={(e) => handleChange('guardian.relationship', e.target.value)}
                                options={relationshipOptions}
                                error={errors['guardian.relationship']}
                                required
                            />
                        </FormColumn>
                    )}
                </FormSection>
            )}

            <FormActions>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Anuluj
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditMode ? 'Zapisz zmiany' : 'Dodaj dziecko'}
                </Button>
            </FormActions>
        </FormContainer>
    );
};