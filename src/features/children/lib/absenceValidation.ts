// src/features/children/lib/absenceValidation.ts
import { z } from 'zod';

export const createAbsenceSchema = z
    .object({
        type: z.enum(['FULL_DAY', 'SPECIFIC_SCHEDULE'], {
            required_error: 'Typ nieobecności jest wymagany',
        }),
        startDate: z
            .string()
            .min(1, 'Data rozpoczęcia jest wymagana')
            .refine(
                (date) => {
                    const selected = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selected >= today;
                },
                { message: 'Data rozpoczęcia nie może być w przeszłości' }
            ),
        endDate: z.string().min(1, 'Data zakończenia jest wymagana'),
        scheduleId: z.string().nullable(),
        reason: z
            .string()
            .max(1000, 'Powód może mieć maksymalnie 1000 znaków')
            .optional(),
    })
    .refine(
        (data) => {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return end >= start;
        },
        {
            message: 'Data zakończenia musi być równa lub późniejsza niż data rozpoczęcia',
            path: ['endDate'],
        }
    )
    .refine(
        (data) => {
            if (data.type === 'SPECIFIC_SCHEDULE') {
                return data.scheduleId !== null && data.scheduleId !== '';
            }
            return true;
        },
        {
            message: 'Harmonogram jest wymagany dla nieobecności specyficznej',
            path: ['scheduleId'],
        }
    )
    .refine(
        (data) => {
            if (data.type === 'FULL_DAY') {
                return data.scheduleId === null || data.scheduleId === '';
            }
            return true;
        },
        {
            message: 'Harmonogram musi być pusty dla całodniowej nieobecności',
            path: ['scheduleId'],
        }
    );

export type CreateAbsenceFormData = z.infer<typeof createAbsenceSchema>;

export const cancelAbsenceSchema = z.object({
    reason: z
        .string()
        .min(1, 'Powód anulowania jest wymagany')
        .max(1000, 'Powód może mieć maksymalnie 1000 znaków'),
});

export type CancelAbsenceFormData = z.infer<typeof cancelAbsenceSchema>;