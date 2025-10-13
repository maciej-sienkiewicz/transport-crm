import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export const useLogout = () => {
    const clearUser = useAuthStore((state) => state.clearUser);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            clearUser();
            queryClient.clear();
            window.location.href = '/login';
        },
    });
};