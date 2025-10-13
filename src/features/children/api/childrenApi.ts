import { apiClient } from '@/shared/api/client';
import { PaginationParams, PageableResponse } from '@/shared/types/api';
import {
    Child,
    ChildListItem,
    ChildDetail,
    CreateChildRequest,
    UpdateChildRequest,
    ChildStatus,
} from '../types';

interface GetChildrenParams extends PaginationParams {
    status?: ChildStatus;
}

export const childrenApi = {
    getAll: async (params: GetChildrenParams): Promise<PageableResponse<ChildListItem>> => {
        const response = await apiClient.get<PageableResponse<ChildListItem>>('/children', {
            params: {
                page: params.page || 0,
                size: params.size || 20,
                sort: params.sort || 'lastName,asc',
                status: params.status,
            },
        });
        return response.data;
    },

    getById: async (id: string): Promise<ChildDetail> => {
        const response = await apiClient.get<ChildDetail>(`/children/${id}`);
        return response.data;
    },

    create: async (data: CreateChildRequest): Promise<Child> => {
        const response = await apiClient.post<Child>('/children', data);
        return response.data;
    },

    update: async (id: string, data: UpdateChildRequest): Promise<Child> => {
        const response = await apiClient.put<Child>(`/children/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/children/${id}`);
    },
};