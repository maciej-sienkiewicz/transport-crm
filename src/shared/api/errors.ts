import axios from 'axios';

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public errors?: Record<string, string>
    ) {
        super(message);
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    get isValidationError(): boolean {
        return this.statusCode === 400 && Boolean(this.errors);
    }

    get isUnauthorized(): boolean {
        return this.statusCode === 401;
    }

    get isForbidden(): boolean {
        return this.statusCode === 403;
    }

    get isNotFound(): boolean {
        return this.statusCode === 404;
    }

    get isServerError(): boolean {
        return this.statusCode >= 500;
    }

    get isNetworkError(): boolean {
        return this.statusCode === 0;
    }
}

export const handleApiError = (error: unknown): ApiError => {
    if (error instanceof ApiError) {
        return error;
    }

    if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 0;
        const message = error.response?.data?.message ?? 'Nieoczekiwany błąd';
        const errors = error.response?.data?.errors;

        return new ApiError(status, message, errors);
    }

    return new ApiError(0, 'Nieoczekiwany błąd aplikacji', undefined);
};