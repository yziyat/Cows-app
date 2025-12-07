
export interface User {
    id?: string;
    username: string;
    email: string;
    role: 'admin' | 'user' | 'viewer';
    created_at?: Date;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}
