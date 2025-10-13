// src/features/vehicles/hooks/useVehicles.ts
import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '../api/vehiclesApi';
import { PaginationParams } from '@/shared/types/api';
import { VehicleStatus, VehicleType } from '../types';

interface UseVehiclesParams extends PaginationParams {
    status?: VehicleStatus;
    vehicleType?: VehicleType;
}

export const useVehicles = (params: UseVehiclesParams) => {
    return useQuery({
        queryKey: ['vehicles', params],
        queryFn: () => vehiclesApi.getAll(params),
        staleTime: 30_000,
    });
};