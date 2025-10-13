// src/features/vehicles/components/VehicleForm/VehicleForm.tsx
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
    createVehicleFormSchema,
    updateVehicleFormSchema,
    CreateVehicleFormData,
    UpdateVehicleFormData
} from '../../lib/validation';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { vehicleTypeOptions, vehicleStatusOptions } from '../../lib/constants';
import {
    FormContainer,
    FormSection,
    SectionTitle,
    FormRow,
    FormRow3,
    EquipmentList,
    EquipmentItem,
    EquipmentInput,
    RemoveButton,
    AddButton,
    FormActions,
} from './VehicleForm.styles';

interface VehicleFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<CreateVehicleFormData | UpdateVehicleFormData>;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
                                                            mode,
                                                            initialData,
                                                            onSubmit,
                                                            onCancel,
                                                            isLoading = false,
                                                        }) => {
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState<any>(initialData || {
        registrationNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vehicleType: 'MICROBUS',
        capacity: {
            totalSeats: 12,
            wheelchairSpaces: 2,
            childSeats: 10,
        },
        specialEquipment: [],
        insurance: {
            policyNumber: '',
            validUntil: '',
            insurer: '',
        },
        technicalInspection: {
            validUntil: '',
            inspectionStation: '',
        },
        vin: '',
        ...(isEditMode && {
            status: 'AVAILABLE',
            currentMileage: 0,
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

    const handleAddEquipment = () => {
        setFormData((prev: any) => ({
            ...prev,
            specialEquipment: [...(prev.specialEquipment || []), ''],
        }));
    };

    const handleRemoveEquipment = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            specialEquipment: prev.specialEquipment.filter((_: any, i: number) => i !== index),
        }));
    };

    const handleEquipmentChange = (index: number, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            specialEquipment: prev.specialEquipment.map((item: string, i: number) =>
                i === index ? value : item
            ),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const schema = isEditMode ? updateVehicleFormSchema : createVehicleFormSchema;

            const dataToValidate = {
                ...formData,
                year: parseInt(formData.year),
                currentMileage: isEditMode ? parseInt(formData.currentMileage) : undefined,
                capacity: {
                    totalSeats: parseInt(formData.capacity.totalSeats),
                    wheelchairSpaces: parseInt(formData.capacity.wheelchairSpaces),
                    childSeats: parseInt(formData.capacity.childSeats),
                },
                specialEquipment: (formData.specialEquipment || []).filter((item: string) => item.trim() !== ''),
            };

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
                <SectionTitle>Dane podstawowe</SectionTitle>
                <FormRow>
                    <Input
                        label="Numer rejestracyjny"
                        value={formData.registrationNumber}
                        onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
                        error={errors.registrationNumber}
                        placeholder="WAW 1234A"
                        required
                    />
                    <Select
                        label="Typ pojazdu"
                        value={formData.vehicleType}
                        onChange={(e) => handleChange('vehicleType', e.target.value)}
                        options={vehicleTypeOptions}
                        error={errors.vehicleType}
                        required
                        disabled={isEditMode}
                    />
                </FormRow>

                {!isEditMode && (
                    <>
                        <FormRow3>
                            <Input
                                label="Marka"
                                value={formData.make}
                                onChange={(e) => handleChange('make', e.target.value)}
                                error={errors.make}
                                required
                            />
                            <Input
                                label="Model"
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                error={errors.model}
                                required
                            />
                            <Input
                                label="Rok produkcji"
                                type="number"
                                value={formData.year}
                                onChange={(e) => handleChange('year', e.target.value)}
                                error={errors.year}
                                min="1990"
                                max={new Date().getFullYear() + 1}
                                required
                            />
                        </FormRow3>
                        <Input
                            label="VIN"
                            value={formData.vin}
                            onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                            error={errors.vin}
                            maxLength={17}
                            placeholder="Opcjonalnie"
                        />
                    </>
                )}

                {isEditMode && (
                    <FormRow>
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            options={vehicleStatusOptions}
                            error={errors.status}
                            required
                        />
                        <Input
                            label="Przebieg (km)"
                            type="number"
                            value={formData.currentMileage}
                            onChange={(e) => handleChange('currentMileage', e.target.value)}
                            error={errors.currentMileage}
                            min="0"
                            required
                        />
                    </FormRow>
                )}
            </FormSection>

            {!isEditMode && (
                <FormSection>
                    <SectionTitle>Pojemność</SectionTitle>
                    <FormRow3>
                        <Input
                            label="Liczba miejsc"
                            type="number"
                            value={formData.capacity.totalSeats}
                            onChange={(e) => handleChange('capacity.totalSeats', e.target.value)}
                            error={errors['capacity.totalSeats']}
                            min="1"
                            max="50"
                            required
                        />
                        <Input
                            label="Miejsca na wózki"
                            type="number"
                            value={formData.capacity.wheelchairSpaces}
                            onChange={(e) => handleChange('capacity.wheelchairSpaces', e.target.value)}
                            error={errors['capacity.wheelchairSpaces']}
                            min="0"
                            max="10"
                            required
                        />
                        <Input
                            label="Foteliki dziecięce"
                            type="number"
                            value={formData.capacity.childSeats}
                            onChange={(e) => handleChange('capacity.childSeats', e.target.value)}
                            error={errors['capacity.childSeats']}
                            min="0"
                            max="50"
                            required
                        />
                    </FormRow3>
                </FormSection>
            )}

            {!isEditMode && (
                <FormSection>
                    <SectionTitle>Wyposażenie specjalne</SectionTitle>
                    <EquipmentList>
                        {(formData.specialEquipment || []).map((item: string, index: number) => (
                            <EquipmentItem key={index}>
                                <EquipmentInput
                                    value={item}
                                    onChange={(e) => handleEquipmentChange(index, e.target.value)}
                                    placeholder="Nazwa wyposażenia"
                                />
                                <RemoveButton
                                    type="button"
                                    onClick={() => handleRemoveEquipment(index)}
                                >
                                    <X size={16} />
                                </RemoveButton>
                            </EquipmentItem>
                        ))}
                    </EquipmentList>
                    <AddButton type="button" onClick={handleAddEquipment}>
                        <Plus size={16} />
                        Dodaj wyposażenie
                    </AddButton>
                </FormSection>
            )}

            <FormSection>
                <SectionTitle>Ubezpieczenie</SectionTitle>
                <FormRow>
                    <Input
                        label="Numer polisy"
                        value={formData.insurance.policyNumber}
                        onChange={(e) => handleChange('insurance.policyNumber', e.target.value)}
                        error={errors['insurance.policyNumber']}
                        required
                    />
                    <Input
                        label="Ubezpieczyciel"
                        value={formData.insurance.insurer}
                        onChange={(e) => handleChange('insurance.insurer', e.target.value)}
                        error={errors['insurance.insurer']}
                        required
                    />
                </FormRow>
                <Input
                    label="Ważne do"
                    type="date"
                    value={formData.insurance.validUntil}
                    onChange={(e) => handleChange('insurance.validUntil', e.target.value)}
                    error={errors['insurance.validUntil']}
                    required
                />
            </FormSection>

            <FormSection>
                <SectionTitle>Przegląd techniczny</SectionTitle>
                <Input
                    label="Stacja kontroli pojazdów"
                    value={formData.technicalInspection.inspectionStation}
                    onChange={(e) => handleChange('technicalInspection.inspectionStation', e.target.value)}
                    error={errors['technicalInspection.inspectionStation']}
                    required
                />
                <Input
                    label="Ważny do"
                    type="date"
                    value={formData.technicalInspection.validUntil}
                    onChange={(e) => handleChange('technicalInspection.validUntil', e.target.value)}
                    error={errors['technicalInspection.validUntil']}
                    required
                />
            </FormSection>

            <FormActions>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Anuluj
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditMode ? 'Zapisz zmiany' : 'Dodaj pojazd'}
                </Button>
            </FormActions>
        </FormContainer>
    );
};