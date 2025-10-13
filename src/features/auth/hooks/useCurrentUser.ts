import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export const useCurrentUser = () => {
    const { setUser} = useAuthStore();

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            try {
                const user = await authApi.getCurrentUser();
                setUser(user);
                return user;
            } catch (error) {
                setUser(null);
                throw error;
            }
        },
        retry: false,
        staleTime: Infinity,
    });
};