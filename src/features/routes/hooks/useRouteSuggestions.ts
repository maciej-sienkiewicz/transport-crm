// src/features/routes/hooks/useRouteSuggestions.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { RouteDetail } from '../types';

interface RouteSuggestionsParams {
    scheduleId: string;
    date: string;
    maxResults?: number;
}

export const useRouteSuggestions = (
    params: RouteSuggestionsParams,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: ['route-suggestions', params.scheduleId, params.date],
        queryFn: async () => {
            const response = await apiClient.get<RouteDetail[]>('/routes/suggestions', {
                params: {
                    scheduleId: params.scheduleId,
                    date: params.date,
                    maxResults: params.maxResults || 3,
                },
            });
            return response.data;
        },
        enabled: enabled && !!params.scheduleId && !!params.date,
        staleTime: 60_000, // 1 minuta
    });
};