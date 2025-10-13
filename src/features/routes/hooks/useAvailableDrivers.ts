import { useDrivers } from '@/features/drivers/hooks/useDrivers';

export const useAvailableDrivers = () => {
    return useDrivers({
        status: 'ACTIVE',
        page: 0,
        size: 100,
    });
};