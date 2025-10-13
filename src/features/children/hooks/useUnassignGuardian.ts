import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { guardianAssignmentApi } from '../api/guardianAssignmentApi';

export const useUnassignGuardian = (childId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (guardianId: string) =>
            guardianAssignmentApi.unassign(guardianId, childId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['child', childId] });
            queryClient.invalidateQueries({ queryKey: ['children'] });
            toast.success('Opiekun został odłączony');
        },
    });
};