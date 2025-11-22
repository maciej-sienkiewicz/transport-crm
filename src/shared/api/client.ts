import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './errors';

interface ApiErrorResponse {
    message: string;
    timestamp: string;
    errors?: Record<string, string>;
    conflicts?: {
        singleRoutes: Record<string, string[]>;
        series: Record<string, string>;
    };
}

export const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login?session=expired';
                }

                return Promise.reject(
                    new ApiError(
                        status,
                        'Sesja wygasła. Zaloguj się ponownie.',
                        data?.errors,
                        data // DODANE: przekazujemy pełne dane
                    )
                );
            }

            if (status === 403) {
                return Promise.reject(
                    new ApiError(
                        status,
                        'Nie masz uprawnień do wykonania tej operacji.',
                        data?.errors,
                        data // DODANE
                    )
                );
            }

            if (status === 404) {
                return Promise.reject(
                    new ApiError(
                        status,
                        data?.message || 'Nie znaleziono zasobu.',
                        data?.errors,
                        data // DODANE
                    )
                );
            }

            if (status === 409) {
                return Promise.reject(
                    new ApiError(
                        status,
                        data?.message || 'Konflikt danych.',
                        data?.errors,
                        data
                    )
                );
            }

            if (status >= 500) {
                return Promise.reject(
                    new ApiError(
                        status,
                        'Wystąpił błąd serwera. Spróbuj ponownie później.',
                        data?.errors,
                        data // DODANE
                    )
                );
            }

            return Promise.reject(
                new ApiError(
                    status,
                    data?.message || 'Wystąpił nieoczekiwany błąd.',
                    data?.errors,
                    data // DODANE
                )
            );
        }

        if (error.request) {
            return Promise.reject(
                new ApiError(
                    0,
                    'Brak połączenia z serwerem. Sprawdź połączenie internetowe.',
                    undefined,
                    undefined
                )
            );
        }

        return Promise.reject(
            new ApiError(
                0,
                'Wystąpił nieoczekiwany błąd.',
                undefined,
                undefined
            )
        );
    }
);