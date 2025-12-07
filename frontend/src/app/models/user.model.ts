// src/app/models/user.model.ts
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    first_name?: string;
    last_name?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
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
