export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user?: User;
}