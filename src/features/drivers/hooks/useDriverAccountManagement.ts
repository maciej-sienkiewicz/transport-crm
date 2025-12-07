import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { driversApi } from '../api/driversApi';

export const useUnlockAccount = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => driversApi.unlockAccount(driverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver', driverId] });
            queryClient.invalidateQueries({ queryKey: ['driver-detail', driverId] });
            toast.success('Konto zostało odblokowane');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Nie udało się odblokować konta');
        },
    });
};

export const useResetPassword = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => driversApi.resetPassword(driverId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['driver', driverId] });
            queryClient.invalidateQueries({ queryKey: ['driver-detail', driverId] });
            toast.success(`Hasło zostało zresetowane. Nowy PIN: ${data.newPin}`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Nie udało się zresetować hasła');
        },
    });
};

export const useSuspendAccount = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => driversApi.suspendAccount(driverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver', driverId] });
            queryClient.invalidateQueries({ queryKey: ['driver-detail', driverId] });
            toast.success('Konto zostało zawieszone');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Nie udało się zawiesić konta');
        },
    });
};

export const useUnsuspendAccount = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => driversApi.unsuspendAccount(driverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver', driverId] });
            queryClient.invalidateQueries({ queryKey: ['driver-detail', driverId] });
            toast.success('Konto zostało przywrócone');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Nie udało się przywrócić konta');
        },
    });
};