import { useVehicles } from '@/features/vehicles/hooks/useVehicles';

export const useAvailableVehicles = () => {
    return useVehicles({
        status: 'AVAILABLE',
        page: 0,
        size: 100,
    });
};