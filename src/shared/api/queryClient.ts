import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ApiError } from './errors';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: (failureCount, error) => {
                if (error instanceof ApiError) {
                    if (error.isUnauthorized || error.isForbidden) {
                        return false;
                    }
                    if (error.isServerError && failureCount < 2) {
                        return true;
                    }
                }
                return false;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 0,
            onError: (error) => {
                if (error instanceof ApiError) {
                    if (!error.isUnauthorized) {
                        toast.error(error.message);
                    }
                } else {
                    toast.error('Wystąpił nieoczekiwany błąd');
                }
            },
        },
    },
});