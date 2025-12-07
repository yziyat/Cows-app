export interface Semen {
    id?: string;
    bull_name: string;
    bull_registration?: string;
    breed: string;
    batch_number: string;
    production_date?: Date;
    expiry_date?: Date;
    storage_location: string;
    quantity_available: number;
    unit: 'straws' | 'doses';
    price_per_unit?: number;
    supplier?: string;
    notes?: string;
    status: 'available' | 'low_stock' | 'expired' | 'depleted';
    created_at?: Date;
    updated_at?: Date;
}

export interface Inseminator {
    id?: string;
    name: string;
    license_number?: string;
    phone?: string;
    email?: string;
    specialization?: string;
    status: 'active' | 'inactive';
    total_inseminations?: number;
    success_rate?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface ProtocolApplyer {
    id?: string;
    name: string;
    employee_id?: string;
    phone?: string;
    email?: string;
    role: 'veterinarian' | 'technician' | 'farm_staff';
    status: 'active' | 'inactive';
    protocols_applied?: number;
    created_at?: Date;
    updated_at?: Date;
}
