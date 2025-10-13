import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardianAssignmentApi } from '../api/guardianAssignmentApi';
import { AssignGuardianRequest } from '../types';

export const useAssignGuardian = (childId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         guardianId,
                         data,
                     }: {
            guardianId: string;
            data: AssignGuardianRequest;
        }) => guardianAssignmentApi.assign(guardianId, childId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['child', childId] });
            queryClient.invalidateQueries({ queryKey: ['children'] });
            toast.success('Opiekun został przypisany');
        },
    });
};