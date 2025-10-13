// src/features/drivers/components/DriverForm/DriverForm.tsx
import React, { useState } from 'react';
import {
    createDriverFormSchema,
    updateDriverFormSchema,
    CreateDriverFormData,
    UpdateDriverFormData
} from '../../lib/validation';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { MultiSelect } from '@/shared/ui/MultiSelect';
import { licenseCategoryOptions, driverStatusOptions } from '../../lib/constants';
import {
    FormContainer,
    FormSection,
    SectionTitle,
    FormRow,
    FormActions,
} from './DriverForm.styles';

interface DriverFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<CreateDriverFormData | UpdateDriverFormData>;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const DriverForm: React.FC<DriverFormProps> = ({
                                                          mode,
                                                          initialData,
                                                          onSubmit,
                                                          onCancel,
                                                          isLoading = false,
                                                      }) => {
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState<any>(initialData || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: {
            street: '',
            houseNumber: '',
            apartmentNumber: '',
            postalCode: '',
            city: '',
        },
        drivingLicense: {
            licenseNumber: '',
            categories: [],
            validUntil: '',
        },
        medicalCertificate: {
            validUntil: '',
            issueDate: '',
        },
        ...(isEditMode && {
            status: 'ACTIVE',
        }),
    });

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
            const schema = isEditMode ? updateDriverFormSchema : createDriverFormSchema;
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
                <FormRow>
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        error={errors.email}
                        required
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
                {!isEditMode && (
                    <Input
                        label="Data urodzenia"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        error={errors.dateOfBirth}
                        required
                    />
                )}
                {isEditMode && (
                    <Select
                        label="Status"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        options={driverStatusOptions}
                        error={errors.status}
                        required
                    />
                )}
            </FormSection>

            <FormSection>
                <SectionTitle>Adres</SectionTitle>
                <FormRow>
                    <Input
                        label="Ulica"
                        value={formData.address.street}
                        onChange={(e) => handleChange('address.street', e.target.value)}
                        error={errors['address.street']}
                        required
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Numer domu"
                            value={formData.address.houseNumber}
                            onChange={(e) => handleChange('address.houseNumber', e.target.value)}
                            error={errors['address.houseNumber']}
                            required
                        />
                        <Input
                            label="Numer mieszkania"
                            value={formData.address.apartmentNumber}
                            onChange={(e) => handleChange('address.apartmentNumber', e.target.value)}
                            error={errors['address.apartmentNumber']}
                        />
                    </div>
                </FormRow>
                <FormRow>
                    <Input
                        label="Kod pocztowy"
                        value={formData.address.postalCode}
                        onChange={(e) => handleChange('address.postalCode', e.target.value)}
                        error={errors['address.postalCode']}
                        placeholder="00-000"
                        required
                    />
                    <Input
                        label="Miasto"
                        value={formData.address.city}
                        onChange={(e) => handleChange('address.city', e.target.value)}
                        error={errors['address.city']}
                        required
                    />
                </FormRow>
            </FormSection>

            <FormSection>
                <SectionTitle>Prawo jazdy</SectionTitle>
                <Input
                    label="Numer prawa jazdy"
                    value={formData.drivingLicense.licenseNumber}
                    onChange={(e) => handleChange('drivingLicense.licenseNumber', e.target.value)}
                    error={errors['drivingLicense.licenseNumber']}
                    required
                />
                <MultiSelect
                    label="Kategorie prawa jazdy"
                    required
                    options={licenseCategoryOptions}
                    value={formData.drivingLicense.categories}
                    onChange={(value) => handleChange('drivingLicense.categories', value)}
                    error={errors['drivingLicense.categories']}
                />
                <Input
                    label="Ważne do"
                    type="date"
                    value={formData.drivingLicense.validUntil}
                    onChange={(e) => handleChange('drivingLicense.validUntil', e.target.value)}
                    error={errors['drivingLicense.validUntil']}
                    required
                />
            </FormSection>

            <FormSection>
                <SectionTitle>Badania lekarskie</SectionTitle>
                <FormRow>
                    <Input
                        label="Data wydania"
                        type="date"
                        value={formData.medicalCertificate.issueDate}
                        onChange={(e) => handleChange('medicalCertificate.issueDate', e.target.value)}
                        error={errors['medicalCertificate.issueDate']}
                        required
                    />
                    <Input
                        label="Ważne do"
                        type="date"
                        value={formData.medicalCertificate.validUntil}
                        onChange={(e) => handleChange('medicalCertificate.validUntil', e.target.value)}
                        error={errors['medicalCertificate.validUntil']}
                        required
                    />
                </FormRow>
            </FormSection>

            <FormActions>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Anuluj
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditMode ? 'Zapisz zmiany' : 'Dodaj kierowcę'}
                </Button>
            </FormActions>
        </FormContainer>
    );
};