import { apiClient } from '@/shared/api/client';
import { GuardianAssignment, AssignGuardianRequest } from '../types';

export const guardianAssignmentApi = {
    assign: async (
        guardianId: string,
        childId: string,
        data: AssignGuardianRequest
    ): Promise<GuardianAssignment> => {
        const response = await apiClient.post<GuardianAssignment>(
            `/guardians/${guardianId}/children/${childId}`,
            data
        );
        return response.data;
    },

    unassign: async (guardianId: string, childId: string): Promise<void> => {
        await apiClient.delete(`/guardians/${guardianId}/children/${childId}`);
    },
};