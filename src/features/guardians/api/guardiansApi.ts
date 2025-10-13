import { apiClient } from '@/shared/api/client';
import { PaginationParams, PageableResponse } from '@/shared/types/api';
import {
    Guardian,
    GuardianListItem,
    GuardianDetail,
    CreateGuardianRequest,
    UpdateGuardianRequest,
} from '../types';

interface GetGuardiansParams extends PaginationParams {
    search?: string;
}

export const guardiansApi = {
    getAll: async (params: GetGuardiansParams): Promise<PageableResponse<GuardianListItem>> => {
        const response = await apiClient.get<PageableResponse<GuardianListItem>>('/guardians', {
            params: {
                page: params.page || 0,
                size: params.size || 20,
                sort: params.sort || 'lastName,asc',
                search: params.search,
            },
        });
        return response.data;
    },

    getById: async (id: string): Promise<GuardianDetail> => {
        const response = await apiClient.get<GuardianDetail>(`/guardians/${id}`);
        return response.data;
    },

    create: async (data: CreateGuardianRequest): Promise<Guardian> => {
        const response = await apiClient.post<Guardian>('/guardians', data);
        return response.data;
    },

    update: async (id: string, data: UpdateGuardianRequest): Promise<Guardian> => {
        const response = await apiClient.put<Guardian>(`/guardians/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/guardians/${id}`);
    },
};