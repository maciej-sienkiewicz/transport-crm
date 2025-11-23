import React, { useState } from 'react';
import { guardianFormSchema, GuardianFormData } from '../../lib/validation';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import {
    FormContainer,
    FormSection,
    SectionTitle,
    FormRow,
    FormActions,
} from './GuardianForm.styles';

interface GuardianFormProps {
    initialData?: Partial<GuardianFormData>;
    onSubmit: (data: GuardianFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const GuardianForm: React.FC<GuardianFormProps> = ({
                                                              initialData,
                                                              onSubmit,
                                                              onCancel,
                                                              isLoading = false,
                                                          }) => {
    const [formData, setFormData] = useState<GuardianFormData>({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        address: initialData?.address || {
            street: '',
            houseNumber: '',
            apartmentNumber: '',
            postalCode: '',
            city: '',
        },
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        if (field.startsWith('address.')) {
            const addressField = field.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address!,
                    [addressField]: value,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = guardianFormSchema.parse(formData);
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
                <SectionTitle>Dane osobowe</SectionTitle>
                <FormRow>
                    <Input
                        label="Imię"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        error={errors.firstName}
                        required
                    />
                    <Input
                        label="Nazwisko"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        error={errors.lastName}
                        required
                    />
                </FormRow>
            </FormSection>

            <FormSection>
                <SectionTitle>Dane kontaktowe</SectionTitle>
                <FormRow>
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        error={errors.email}
                    />
                    <Input
                        label="Telefon"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        error={errors.phone}
                        placeholder="+48123456789"
                        required
                    />
                </FormRow>
            </FormSection>

            <FormSection>
                <SectionTitle>Adres (opcjonalnie)</SectionTitle>
                <FormRow>
                    <Input
                        label="Ulica"
                        value={formData.address?.street || ''}
                        onChange={(e) => handleChange('address.street', e.target.value)}
                        error={errors['address.street']}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Numer domu"
                            value={formData.address?.houseNumber || ''}
                            onChange={(e) => handleChange('address.houseNumber', e.target.value)}
                            error={errors['address.houseNumber']}
                        />
                        <Input
                            label="Numer mieszkania"
                            value={formData.address?.apartmentNumber || ''}
                            onChange={(e) => handleChange('address.apartmentNumber', e.target.value)}
                            error={errors['address.apartmentNumber']}
                        />
                    </div>
                </FormRow>
                <FormRow>
                    <Input
                        label="Kod pocztowy"
                        value={formData.address?.postalCode || ''}
                        onChange={(e) => handleChange('address.postalCode', e.target.value)}
                        error={errors['address.postalCode']}
                        placeholder="00-000"
                    />
                    <Input
                        label="Miasto"
                        value={formData.address?.city || ''}
                        onChange={(e) => handleChange('address.city', e.target.value)}
                        error={errors['address.city']}
                    />
                </FormRow>
            </FormSection>

            <FormActions>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Anuluj
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? 'Zapisz zmiany' : 'Dodaj opiekuna'}
                </Button>
            </FormActions>
        </FormContainer>
    );
};