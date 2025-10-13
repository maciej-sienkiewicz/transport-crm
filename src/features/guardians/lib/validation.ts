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

export const guardianFormSchema = z.object({
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
    alternatePhone: z
        .string()
        .regex(/^\+?[0-9\s\-()]{9,20}$/, 'Nieprawidłowy format numeru telefonu')
        .optional()
        .or(z.literal('')),
    address: addressSchema,
    communicationPreference: z.enum(['SMS', 'EMAIL', 'PHONE', 'APP']),
});

export type GuardianFormData = z.infer<typeof guardianFormSchema>;