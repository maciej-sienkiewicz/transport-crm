// src/features/drivers/hooks/useDriverAbsences.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { driversApi } from '../api/driversApi';
import { CreateDriverAbsenceRequest, CancelDriverAbsenceRequest } from '../types';
import { CreateDriverAbsenceResponse } from '@/shared/types/routeImpact';

export const useDriverAbsences = (driverId: string) => {
    return useQuery({
        queryKey: ['driver-absences', driverId],
        queryFn: () => driversApi.getAbsences(driverId),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });
};

export const useCreateDriverAbsence = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation<CreateDriverAbsenceResponse, Error, CreateDriverAbsenceRequest>({
        mutationFn: (data: CreateDriverAbsenceRequest) =>
            driversApi.createAbsence(driverId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-absences', driverId] });
            queryClient.invalidateQueries({ queryKey: ['driver-detail', driverId] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });
            toast.success('Nieobecność została zgłoszona');
        },
        onError: () => {
            toast.error('Nie udało się zgłosić nieobecności');
        },
    });
};

export const useCancelDriverAbsence = (driverId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ absenceId, data }: { absenceId: string; data: CancelDriverAbsenceRequest }) =>
            driversApi.cancelAbsence(driverId, absenceId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['driver-absences', driverId] });
            queryClient.invalidateQueries({ queryKey: ['driver-detail', driverId] });
            toast.success('Nieobecność została anulowana');
        },
    });
};