// src/features/drivers/lib/absenceValidation.ts
import { z } from 'zod';

export const createDriverAbsenceSchema = z.object({
    type: z.enum(['SICK_LEAVE', 'VACATION', 'PERSONAL_LEAVE', 'UNPAID_LEAVE', 'OTHER']),
    startDate: z.string().min(1, 'Data rozpoczęcia jest wymagana'),
    endDate: z.string().min(1, 'Data zakończenia jest wymagana'),
    reason: z.string().max(1000).optional(),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
}, {
    message: 'Data zakończenia musi być późniejsza lub równa dacie rozpoczęcia',
    path: ['endDate'],
});

export const cancelDriverAbsenceSchema = z.object({
    reason: z.string().min(1, 'Powód anulowania jest wymagany').max(1000),
});

export type CreateDriverAbsenceFormData = z.infer<typeof createDriverAbsenceSchema>;
export type CancelDriverAbsenceFormData = z.infer<typeof cancelDriverAbsenceSchema>;