// src/features/routes/hooks/useAvailableDrivers.ts

import { useDrivers } from '@/features/drivers/hooks/useDrivers';

interface UseAvailableDriversOptions {
    date?: string;
    enabled?: boolean;
}

export const useAvailableDrivers = (options?: UseAvailableDriversOptions) => {
    return useDrivers({
        status: 'ACTIVE',
        page: 0,
        size: 100,
    });
};