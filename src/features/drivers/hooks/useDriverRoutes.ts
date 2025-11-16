// src/features/drivers/hooks/useDriverRoutes.ts
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../api/driversApi';
import { useState } from 'react';

export const usePlannedRoutes = (driverId: string, date?: string) => {
    return useQuery({
        queryKey: ['driver-planned-routes', driverId, date],
        queryFn: () => driversApi.getPlannedRoutes(driverId, date),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });
};

export const useRouteHistory = (driverId: string) => {
    const [page, setPage] = useState(0);
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();

    const query = useQuery({
        queryKey: ['driver-route-history', driverId, page, startDate, endDate],
        queryFn: () => driversApi.getRouteHistory(driverId, { page, size: 20, startDate, endDate }),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });

    return {
        ...query,
        page,
        setPage,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
    };
};

export const useRouteHistorySummary = (driverId: string, days: number = 30) => {
    return useQuery({
        queryKey: ['driver-route-summary', driverId, days],
        queryFn: () => driversApi.getRouteHistorySummary(driverId, days),
        enabled: Boolean(driverId),
        staleTime: 30_000,
    });
};