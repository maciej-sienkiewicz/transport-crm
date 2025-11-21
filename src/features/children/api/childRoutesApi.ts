// src/features/children/api/childRoutesApi.ts
import { apiClient } from '@/shared/api/client';

interface ChildRouteStop {
    id: string;
    stopType: 'PICKUP' | 'DROPOFF';
    estimatedTime: string;
    address: {
        label: string;
        street: string;
        houseNumber: string;
        apartmentNumber?: string;
        postalCode: string;
        city: string;
    };
}

interface ChildRoute {
    id: string;
    routeName: string;
    date: string;
    status: string;
    driver: {
        firstName: string;
        lastName: string;
    };
    vehicle: {
        registrationNumber: string;
        model: string;
    };
    estimatedStartTime: string;
    estimatedEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    stops: ChildRouteStop[];
    stopsCount: number;
    completedStopsCount?: number;
}

interface ChildRoutesStats {
    totalRoutes: number;
    totalStops: number;
    completedRoutes?: number;
}

interface ChildRoutesResponse {
    routes: ChildRoute[];
    stats: ChildRoutesStats;
}

interface GetChildRoutesParams {
    date?: string;
    from?: string;
    to?: string;
    type: 'history' | 'upcoming';
}

export const childRoutesApi = {
    getRoutes: async (
        childId: string,
        params: GetChildRoutesParams
    ): Promise<ChildRoutesResponse> => {
        const response = await apiClient.get<ChildRoutesResponse>(
            `/children/${childId}/routes`,
            {
                params: {
                    date: params.date,
                    from: params.from,
                    to: params.to,
                    type: params.type,
                },
            }
        );
        return response.data;
    },
};