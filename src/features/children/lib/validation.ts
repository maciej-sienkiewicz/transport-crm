import { z } from 'zod';

const transportNeedsSchema = z.object({
    wheelchair: z.boolean(),
    specialSeat: z.boolean(),
    safetyBelt: z.boolean(),
});

const guardianSchema = z.object({
    existingId: z.string().optional(),
    firstName: z.string().min(1, 'Imię jest wymagane').max(255).optional(),
    lastName: z.string().min(1, 'Nazwisko jest wymagane').max(255).optional(),
    email: z.string().email('Nieprawidłowy format email').max(255).optional(),
    phone: z
        .string()
        .regex(/^\+?[0-9\s\-()]{9,20}$/, 'Nieprawidłowy format numeru telefonu')
        .optional(),
    relationship: z.enum(['PARENT', 'LEGAL_GUARDIAN', 'GRANDPARENT', 'RELATIVE', 'OTHER']).optional(),
}).refine(
    (data) => {
        if (data.existingId) return true;
        return data.firstName && data.lastName && data.email && data.phone && data.relationship;
    },
    {
        message: 'Wybierz istniejącego opiekuna lub uzupełnij wszystkie dane nowego',
    }
);

export const createChildFormSchema = z.object({
    child: z.object({
        firstName: z
            .string()
            .min(1, 'Imię jest wymagane')
            .max(255, 'Imię może mieć maksymalnie 255 znaków'),
        lastName: z
            .string()
            .min(1, 'Nazwisko jest wymagane')
            .max(255, 'Nazwisko może mieć maksymalnie 255 znaków'),
        birthDate: z
            .string()
            .min(1, 'Data urodzenia jest wymagana')
            .refine((date) => {
                const birthDate = new Date(date);
                const today = new Date();
                return birthDate < today;
            }, 'Data urodzenia musi być w przeszłości'),
        disability: z
            .array(z.enum(['INTELLECTUAL', 'PHYSICAL', 'SENSORY_VISUAL', 'SENSORY_HEARING', 'AUTISM', 'MULTIPLE', 'SPEECH', 'MENTAL']))
            .min(1, 'Wybierz przynajmniej jedną niepełnosprawność'),
        transportNeeds: transportNeedsSchema,
        notes: z.string().max(5000, 'Notatki mogą mieć maksymalnie 5000 znaków').optional(),
    }),
    guardian: guardianSchema,
});

export const updateChildFormSchema = z.object({
    firstName: z
        .string()
        .min(1, 'Imię jest wymagane')
        .max(255, 'Imię może mieć maksymalnie 255 znaków'),
    lastName: z
        .string()
        .min(1, 'Nazwisko jest wymagane')
        .max(255, 'Nazwisko może mieć maksymalnie 255 znaków'),
    birthDate: z
        .string()
        .min(1, 'Data urodzenia jest wymagana')
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            return birthDate < today;
        }, 'Data urodzenia musi być w przeszłości'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'TEMPORARY_INACTIVE']),
    disability: z
        .array(z.enum(['INTELLECTUAL', 'PHYSICAL', 'SENSORY_VISUAL', 'SENSORY_HEARING', 'AUTISM', 'MULTIPLE', 'SPEECH', 'MENTAL']))
        .min(1, 'Wybierz przynajmniej jedną niepełnosprawność'),
    transportNeeds: transportNeedsSchema,
    notes: z.string().max(5000, 'Notatki mogą mieć maksymalnie 5000 znaków').optional(),
});

export type CreateChildFormData = z.infer<typeof createChildFormSchema>;
export type UpdateChildFormData = z.infer<typeof updateChildFormSchema>;