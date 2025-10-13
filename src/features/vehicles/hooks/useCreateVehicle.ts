// src/features/vehicles/hooks/useCreateVehicle.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { vehiclesApi } from '../api/vehiclesApi';
import { CreateVehicleRequest } from '../types';

export const useCreateVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVehicleRequest) => vehiclesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            toast.success('Pojazd został pomyślnie dodany');
        },
    });
};