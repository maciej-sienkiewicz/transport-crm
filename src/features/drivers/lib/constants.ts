// src/features/drivers/lib/constants.ts
import { DriverStatus } from '../types';

export const driverStatusLabels: Record<DriverStatus, string> = {
    ACTIVE: 'Aktywny',
    INACTIVE: 'Nieaktywny',
    ON_LEAVE: 'Na urlopie',
};

export const driverStatusOptions = Object.entries(driverStatusLabels).map(([value, label]) => ({
    value,
    label,
}));

export const licenseCategoryOptions = [
    { value: 'A', label: 'A - Motocykle' },
    { value: 'B', label: 'B - Samochody osobowe' },
    { value: 'C', label: 'C - Samochody ciężarowe' },
    { value: 'D', label: 'D - Autobusy' },
    { value: 'D1', label: 'D1 - Mikrobusy' },
    { value: 'E', label: 'E - Przyczepa' },
];