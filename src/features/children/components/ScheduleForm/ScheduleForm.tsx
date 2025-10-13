import React, { useState } from 'react';
import {
    createScheduleFormSchema,
    updateScheduleFormSchema,
    CreateScheduleFormData,
    UpdateScheduleFormData,
} from '../../lib/scheduleValidation';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { DayOfWeek } from '../../types';
import {
    FormContainer,
    FormSection,
    SectionTitle,
    FormRow,
    AddressGrid,
    DaysSelector,
    DaysGrid,
    DayButton,
    FormActions,
} from './ScheduleForm.styles';

interface ScheduleFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<CreateScheduleFormData | UpdateScheduleFormData>;
    onSubmit: (data: CreateScheduleFormData | UpdateScheduleFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const dayLabels: Record<DayOfWeek, string> = {
    MONDAY: 'Poniedziałek',
    TUESDAY: 'Wtorek',
    WEDNESDAY: 'Środa',
    THURSDAY: 'Czwartek',
    FRIDAY: 'Piątek',
    SATURDAY: 'Sobota',
    SUNDAY: 'Niedziela',
};

const allDays: DayOfWeek[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
];

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
                                                              mode,
                                                              initialData,
                                                              onSubmit,
                                                              onCancel,
                                                              isLoading = false,
                                                          }) => {
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState<any>({
        name: initialData?.name || '',
        days: initialData?.days || [],
        pickupTime: initialData?.pickupTime || '',
        pickupAddress: initialData?.pickupAddress || {
            label: '',
            street: '',
            houseNumber: '',
            apartmentNumber: '',
            postalCode: '',
            city: '',
        },
        dropoffTime: initialData?.dropoffTime || '',
        dropoffAddress: initialData?.dropoffAddress || {
            label: '',
            street: '',
            houseNumber: '',
            apartmentNumber: '',
            postalCode: '',
            city: '',
        },
        specialInstructions: initialData?.specialInstructions || '',
        ...(isEditMode && { active: (initialData as any)?.active ?? true }),
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (path: string, value: any) => {
        const keys = path.split('.');
        setFormData((prev: any) => {
            const newData = { ...prev };
            let current: any = newData;

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

    const toggleDay = (day: DayOfWeek) => {
        const newDays = formData.days.includes(day)
            ? formData.days.filter((d: DayOfWeek) => d !== day)
            : [...formData.days, day];

        handleChange('days', newDays);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            // Użyj odpowiedniego schematu w zależności od trybu
            const schema = isEditMode ? updateScheduleFormSchema : createScheduleFormSchema;
            const validatedData = schema.parse(formData);
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
                <SectionTitle>Podstawowe informacje</SectionTitle>
                <Input
                    label="Nazwa harmonogramu"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    placeholder="np. Do szkoły"
                    required
                />
                <DaysSelector>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        Dni tygodnia *
                    </label>
                    <DaysGrid>
                        {allDays.map((day) => (
                            <DayButton
                                key={day}
                                type="button"
                                $selected={formData.days.includes(day)}
                                onClick={() => toggleDay(day)}
                            >
                                {dayLabels[day]}
                            </DayButton>
                        ))}
                    </DaysGrid>
                    {errors.days && (
                        <span style={{ fontSize: '0.8125rem', color: '#dc2626' }}>
              {errors.days}
            </span>
                    )}
                </DaysSelector>
            </FormSection>

            <FormSection>
                <SectionTitle>Odbiór</SectionTitle>
                <FormRow>
                    <Input
                        label="Godzina odbioru"
                        type="time"
                        value={formData.pickupTime}
                        onChange={(e) => handleChange('pickupTime', e.target.value)}
                        error={errors.pickupTime}
                        required
                    />
                    <Input
                        label="Etykieta miejsca odbioru"
                        value={formData.pickupAddress.label}
                        onChange={(e) => handleChange('pickupAddress.label', e.target.value)}
                        error={errors['pickupAddress.label']}
                        placeholder="np. Dom"
                        required
                    />
                </FormRow>
                <Input
                    label="Ulica"
                    value={formData.pickupAddress.street}
                    onChange={(e) => handleChange('pickupAddress.street', e.target.value)}
                    error={errors['pickupAddress.street']}
                    required
                />
                <AddressGrid>
                    <Input
                        label="Numer domu"
                        value={formData.pickupAddress.houseNumber}
                        onChange={(e) =>
                            handleChange('pickupAddress.houseNumber', e.target.value)
                        }
                        error={errors['pickupAddress.houseNumber']}
                        required
                    />
                    <Input
                        label="Numer mieszkania"
                        value={formData.pickupAddress.apartmentNumber}
                        onChange={(e) =>
                            handleChange('pickupAddress.apartmentNumber', e.target.value)
                        }
                        error={errors['pickupAddress.apartmentNumber']}
                    />
                </AddressGrid>
                <FormRow>
                    <Input
                        label="Kod pocztowy"
                        value={formData.pickupAddress.postalCode}
                        onChange={(e) =>
                            handleChange('pickupAddress.postalCode', e.target.value)
                        }
                        error={errors['pickupAddress.postalCode']}
                        placeholder="00-000"
                        required
                    />
                    <Input
                        label="Miasto"
                        value={formData.pickupAddress.city}
                        onChange={(e) => handleChange('pickupAddress.city', e.target.value)}
                        error={errors['pickupAddress.city']}
                        required
                    />
                </FormRow>
            </FormSection>

            <FormSection>
                <SectionTitle>Dowóz</SectionTitle>
                <FormRow>
                    <Input
                        label="Godzina dowozu"
                        type="time"
                        value={formData.dropoffTime}
                        onChange={(e) => handleChange('dropoffTime', e.target.value)}
                        error={errors.dropoffTime}
                        required
                    />
                    <Input
                        label="Etykieta miejsca dowozu"
                        value={formData.dropoffAddress.label}
                        onChange={(e) => handleChange('dropoffAddress.label', e.target.value)}
                        error={errors['dropoffAddress.label']}
                        placeholder="np. Szkoła"
                        required
                    />
                </FormRow>
                <Input
                    label="Ulica"
                    value={formData.dropoffAddress.street}
                    onChange={(e) => handleChange('dropoffAddress.street', e.target.value)}
                    error={errors['dropoffAddress.street']}
                    required
                />
                <AddressGrid>
                    <Input
                        label="Numer domu"
                        value={formData.dropoffAddress.houseNumber}
                        onChange={(e) =>
                            handleChange('dropoffAddress.houseNumber', e.target.value)
                        }
                        error={errors['dropoffAddress.houseNumber']}
                        required
                    />
                    <Input
                        label="Numer mieszkania"
                        value={formData.dropoffAddress.apartmentNumber}
                        onChange={(e) =>
                            handleChange('dropoffAddress.apartmentNumber', e.target.value)
                        }
                        error={errors['dropoffAddress.apartmentNumber']}
                    />
                </AddressGrid>
                <FormRow>
                    <Input
                        label="Kod pocztowy"
                        value={formData.dropoffAddress.postalCode}
                        onChange={(e) =>
                            handleChange('dropoffAddress.postalCode', e.target.value)
                        }
                        error={errors['dropoffAddress.postalCode']}
                        placeholder="00-000"
                        required
                    />
                    <Input
                        label="Miasto"
                        value={formData.dropoffAddress.city}
                        onChange={(e) => handleChange('dropoffAddress.city', e.target.value)}
                        error={errors['dropoffAddress.city']}
                        required
                    />
                </FormRow>
            </FormSection>

            <FormSection>
                <Input
                    label="Specjalne instrukcje"
                    value={formData.specialInstructions}
                    onChange={(e) => handleChange('specialInstructions', e.target.value)}
                    error={errors.specialInstructions}
                    placeholder="np. Dzwonek przy furtce, zawsze dzwonić przed przyjazdem"
                />
                {isEditMode && (
                    <Checkbox
                        label="Harmonogram aktywny"
                        checked={formData.active}
                        onChange={(e) => handleChange('active', e.target.checked)}
                    />
                )}
            </FormSection>

            <FormActions>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Anuluj
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditMode ? 'Zapisz zmiany' : 'Dodaj harmonogram'}
                </Button>
            </FormActions>
        </FormContainer>
    );
};