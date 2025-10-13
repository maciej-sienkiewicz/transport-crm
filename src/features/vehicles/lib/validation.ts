// src/features/vehicles/lib/validation.ts
import { z } from 'zod';

const capacitySchema = z.object({
    totalSeats: z
        .number()
        .min(1, 'Minimalna liczba miejsc to 1')
        .max(50, 'Maksymalna liczba miejsc to 50'),
    wheelchairSpaces: z
        .number()
        .min(0, 'Liczba miejsc na wózki nie może być ujemna')
        .max(10, 'Maksymalna liczba miejsc na wózki to 10'),
    childSeats: z
        .number()
        .min(0, 'Liczba fotelików nie może być ujemna')
        .max(50, 'Maksymalna liczba fotelików to 50'),
}).refine(
    (data) => data.wheelchairSpaces <= data.totalSeats,
    {
        message: 'Liczba miejsc na wózki nie może przekraczać całkowitej liczby miejsc',
        path: ['wheelchairSpaces'],
    }
).refine(
    (data) => data.childSeats <= data.totalSeats,
    {
        message: 'Liczba fotelików nie może przekraczać całkowitej liczby miejsc',
        path: ['childSeats'],
    }
);

const insuranceSchema = z.object({
    policyNumber: z
        .string()
        .min(1, 'Numer polisy jest wymagany')
        .max(100, 'Numer polisy może mieć maksymalnie 100 znaków'),
    validUntil: z
        .string()
        .min(1, 'Data ważności jest wymagana')
        .refine((date) => {
            const expiryDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return expiryDate >= today;
        }, 'Data ważności ubezpieczenia musi być w przyszłości'),
    insurer: z
        .string()
        .min(1, 'Nazwa ubezpieczyciela jest wymagana')
        .max(255, 'Nazwa ubezpieczyciela może mieć maksymalnie 255 znaków'),
});

const technicalInspectionSchema = z.object({
    validUntil: z
        .string()
        .min(1, 'Data ważności jest wymagana')
        .refine((date) => {
            const expiryDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return expiryDate >= today;
        }, 'Data ważności przeglądu musi być w przyszłości'),
    inspectionStation: z
        .string()
        .min(1, 'Nazwa stacji kontroli jest wymagana')
        .max(255, 'Nazwa stacji może mieć maksymalnie 255 znaków'),
});

export const createVehicleFormSchema = z.object({
    registrationNumber: z
        .string()
        .min(1, 'Numer rejestracyjny jest wymagany')
        .max(20, 'Numer rejestracyjny może mieć maksymalnie 20 znaków')
        .regex(/^[A-Z0-9\s]+$/i, 'Numer rejestracyjny może zawierać tylko litery, cyfry i spacje'),
    make: z
        .string()
        .min(1, 'Marka jest wymagana')
        .max(100, 'Marka może mieć maksymalnie 100 znaków'),
    model: z
        .string()
        .min(1, 'Model jest wymagany')
        .max(100, 'Model może mieć maksymalnie 100 znaków'),
    year: z
        .number()
        .min(1990, 'Rok produkcji nie może być wcześniejszy niż 1990')
        .max(new Date().getFullYear() + 1, 'Rok produkcji nie może być w przyszłości'),
    vehicleType: z.enum(['BUS', 'MICROBUS', 'VAN']),
    capacity: capacitySchema,
    specialEquipment: z.array(z.string()).default([]),
    insurance: insuranceSchema,
    technicalInspection: technicalInspectionSchema,
    vin: z
        .string()
        .max(17, 'VIN może mieć maksymalnie 17 znaków')
        .optional()
        .or(z.literal('')),
});

export const updateVehicleFormSchema = z.object({
    registrationNumber: z
        .string()
        .min(1, 'Numer rejestracyjny jest wymagany')
        .max(20, 'Numer rejestracyjny może mieć maksymalnie 20 znaków')
        .regex(/^[A-Z0-9\s]+$/i, 'Numer rejestracyjny może zawierać tylko litery, cyfry i spacje'),
    status: z.enum(['AVAILABLE', 'IN_ROUTE', 'MAINTENANCE', 'OUT_OF_SERVICE']),
    currentMileage: z
        .number()
        .min(0, 'Przebieg nie może być ujemny')
        .max(9999999, 'Przebieg jest zbyt wysoki'),
    insurance: insuranceSchema,
    technicalInspection: technicalInspectionSchema,
});

export type CreateVehicleFormData = z.infer<typeof createVehicleFormSchema>;
export type UpdateVehicleFormData = z.infer<typeof updateVehicleFormSchema>;