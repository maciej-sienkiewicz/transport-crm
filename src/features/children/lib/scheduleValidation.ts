// src/features/children/lib/scheduleValidation.ts
import { z } from 'zod';

const addressSchema = z.object({
    label: z
        .string()
        .min(1, 'Etykieta adresu jest wymagana')
        .max(100, 'Etykieta może mieć maksymalnie 100 znaków'),
    street: z
        .string()
        .min(1, 'Ulica jest wymagana')
        .max(255, 'Ulica może mieć maksymalnie 255 znaków'),
    houseNumber: z
        .string()
        .min(1, 'Numer domu jest wymagany')
        .max(20, 'Numer domu może mieć maksymalnie 20 znaków'),
    apartmentNumber: z
        .string()
        .max(20, 'Numer mieszkania może mieć maksymalnie 20 znaków')
        .optional()
        .or(z.literal('')),
    postalCode: z
        .string()
        .min(1, 'Kod pocztowy jest wymagany')
        .regex(/^\d{2}-\d{3}$/, 'Nieprawidłowy format kodu pocztowego (XX-XXX)'),
    city: z
        .string()
        .min(1, 'Miasto jest wymagane')
        .max(100, 'Miasto może mieć maksymalnie 100 znaków'),
});

const baseScheduleSchema = z.object({
    name: z
        .string()
        .min(1, 'Nazwa harmonogramu jest wymagana')
        .max(255, 'Nazwa może mieć maksymalnie 255 znaków'),
    days: z
        .array(
            z.enum([
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY',
            ])
        )
        .min(1, 'Wybierz przynajmniej jeden dzień'),
    pickupTime: z
        .string()
        .min(1, 'Czas odbioru jest wymagany')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Nieprawidłowy format czasu (HH:mm)'),
    pickupAddress: addressSchema,
    dropoffTime: z
        .string()
        .min(1, 'Czas dowozu jest wymagany')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Nieprawidłowy format czasu (HH:mm)'),
    dropoffAddress: addressSchema,
    specialInstructions: z
        .string()
        .max(5000, 'Instrukcje mogą mieć maksymalnie 5000 znaków')
        .optional()
        .or(z.literal('')),
});

// Schema dla tworzenia - BEZ active (nowy harmonogram jest zawsze aktywny)
export const createScheduleFormSchema = baseScheduleSchema.refine(
    (data) => {
        const pickup = data.pickupTime.split(':').map(Number);
        const dropoff = data.dropoffTime.split(':').map(Number);
        const pickupMinutes = pickup[0] * 60 + pickup[1];
        const dropoffMinutes = dropoff[0] * 60 + dropoff[1];
        return dropoffMinutes > pickupMinutes;
    },
    {
        message: 'Czas dowozu musi być późniejszy niż czas odbioru',
        path: ['dropoffTime'],
    }
);

// Schema dla aktualizacji - Z active (required)
export const updateScheduleFormSchema = baseScheduleSchema
    .extend({
        active: z.boolean(), // REQUIRED dla update
    })
    .refine(
        (data) => {
            const pickup = data.pickupTime.split(':').map(Number);
            const dropoff = data.dropoffTime.split(':').map(Number);
            const pickupMinutes = pickup[0] * 60 + pickup[1];
            const dropoffMinutes = dropoff[0] * 60 + dropoff[1];
            return dropoffMinutes > pickupMinutes;
        },
        {
            message: 'Czas dowozu musi być późniejszy niż czas odbioru',
            path: ['dropoffTime'],
        }
    );

export type CreateScheduleFormData = z.infer<typeof createScheduleFormSchema>;
export type UpdateScheduleFormData = z.infer<typeof updateScheduleFormSchema>;