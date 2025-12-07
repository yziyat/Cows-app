
export interface User {
    id?: string;
    uid?: string;
    username?: string;
    email: string;
    displayName?: string;
    role: 'admin' | 'user' | 'viewer';
    photoURL?: string;
    created_at?: Date;
    updated_at?: Date;
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
