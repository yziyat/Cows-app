// src/app/models/cattle.model.ts
export interface Cattle {
    id: number;
    ear_tag: string;
    name?: string;
    breed?: string;
    birth_date?: Date;
    sex: 'male' | 'female';
    status: 'active' | 'sold' | 'deceased' | 'culled';
    mother_id?: number;
    father_id?: number;
    mother_tag?: string;
    father_tag?: string;
    weight?: number;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CattleListResponse {
    cattle: Cattle[];
    total: number;
    limit: number;
    offset: number;
}
