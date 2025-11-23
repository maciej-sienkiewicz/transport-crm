import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardiansApi } from '../api/guardiansApi';
import { ResetPasswordRequest } from '../types';

export const useResetGuardianPassword = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ResetPasswordRequest) =>
            guardiansApi.resetPassword(guardianId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['guardian-detail', guardianId] });

            if (data.emailSent && data.smsSent) {
                toast.success('Link do resetu hasła został wysłany emailem i SMS-em');
            } else if (data.emailSent) {
                toast.success('Link do resetu hasła został wysłany emailem');
            } else if (data.smsSent) {
                toast.success('Link do resetu hasła został wysłany SMS-em');
            }
        },
    });
};

export const useCreateGuardianAccount = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => guardiansApi.createAccount(guardianId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardian-detail', guardianId] });
            toast.success('Konto zostało utworzone');
        },
    });
};

export const useDeactivateGuardianAccount = (guardianId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => guardiansApi.deactivateAccount(guardianId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guardian-detail', guardianId] });
            toast.success('Konto zostało dezaktywowane');
        },
    });
};