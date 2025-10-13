// src/features/vehicles/hooks/useVehicle.ts
import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '../api/vehiclesApi';

export const useVehicle = (id: string) => {
    return useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => vehiclesApi.getById(id),
        enabled: Boolean(id),
        staleTime: 30_000,
    });
};