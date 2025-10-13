// src/features/drivers/lib/validation.ts
import { z } from 'zod';

const addressSchema = z.object({
    street: z.string().min(1, 'Ulica jest wymagana').max(255),
    houseNumber: z.string().min(1, 'Numer domu jest wymagany').max(20),
    apartmentNumber: z.string().max(20).optional(),
    postalCode: z
        .string()
        .min(1, 'Kod pocztowy jest wymagany')
        .regex(/^\d{2}-\d{3}$/, 'Nieprawidłowy format kodu pocztowego (XX-XXX)'),
    city: z.string().min(1, 'Miasto jest wymagane').max(100),
});

const drivingLicenseSchema = z.object({
    licenseNumber: z
        .string()
        .min(1, 'Numer prawa jazdy jest wymagany')
        .max(50, 'Numer prawa jazdy może mieć maksymalnie 50 znaków'),
    categories: z
        .array(z.string())
        .min(1, 'Wybierz przynajmniej jedną kategorię')
        .refine(
            (categories) => categories.includes('D') || categories.includes('D1'),
            'Kierowca autobusu musi posiadać kategorię D lub D1'
        ),
    validUntil: z
        .string()
        .min(1, 'Data ważności jest wymagana')
        .refine((date) => {
            const expiryDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return expiryDate >= today;
        }, 'Data ważności prawa jazdy musi być w przyszłości'),
});

const medicalCertificateSchema = z.object({
    validUntil: z
        .string()
        .min(1, 'Data ważności jest wymagana')
        .refine((date) => {
            const expiryDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return expiryDate >= today;
        }, 'Data ważności badań lekarskich musi być w przyszłości'),
    issueDate: z
        .string()
        .min(1, 'Data wydania jest wymagana')
        .refine((date) => {
            const issueDate = new Date(date);
            const today = new Date();
            return issueDate <= today;
        }, 'Data wydania nie może być w przyszłości'),
});

export const createDriverFormSchema = z.object({
    firstName: z
        .string()
        .min(1, 'Imię jest wymagane')
        .max(255, 'Imię może mieć maksymalnie 255 znaków'),
    lastName: z
        .string()
        .min(1, 'Nazwisko jest wymagane')
        .max(255, 'Nazwisko może mieć maksymalnie 255 znaków'),
    email: z
        .string()
        .min(1, 'Email jest wymagany')
        .email('Nieprawidłowy format email')
        .max(255),
    phone: z
        .string()
        .min(1, 'Numer telefonu jest wymagany')
        .regex(/^\+?[0-9\s\-()]{9,20}$/, 'Nieprawidłowy format numeru telefonu'),
    dateOfBirth: z
        .string()
        .min(1, 'Data urodzenia jest wymagana')
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 21;
            }
            return age >= 21;
        }, 'Kierowca musi mieć co najmniej 21 lat'),
    address: addressSchema,
    drivingLicense: drivingLicenseSchema,
    medicalCertificate: medicalCertificateSchema,
});

export const updateDriverFormSchema = z.object({
    firstName: z
        .string()
        .min(1, 'Imię jest wymagane')
        .max(255, 'Imię może mieć maksymalnie 255 znaków'),
    lastName: z
        .string()
        .min(1, 'Nazwisko jest wymagane')
        .max(255, 'Nazwisko może mieć maksymalnie 255 znaków'),
    email: z
        .string()
        .min(1, 'Email jest wymagany')
        .email('Nieprawidłowy format email')
        .max(255),
    phone: z
        .string()
        .min(1, 'Numer telefonu jest wymagany')
        .regex(/^\+?[0-9\s\-()]{9,20}$/, 'Nieprawidłowy format numeru telefonu'),
    address: addressSchema,
    status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']),
    drivingLicense: drivingLicenseSchema,
    medicalCertificate: medicalCertificateSchema,
});

export type CreateDriverFormData = z.infer<typeof createDriverFormSchema>;
export type UpdateDriverFormData = z.infer<typeof updateDriverFormSchema>;