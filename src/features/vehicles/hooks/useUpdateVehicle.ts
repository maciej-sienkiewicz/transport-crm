// src/features/vehicles/hooks/useUpdateVehicle.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { vehiclesApi } from '../api/vehiclesApi';
import { UpdateVehicleRequest } from '../types';

export const useUpdateVehicle = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateVehicleRequest) => vehiclesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
            toast.success('Dane pojazdu zostały zaktualizowane');
        },
    });
};