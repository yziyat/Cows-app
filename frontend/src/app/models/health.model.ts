export interface HealthRecord {
    id: string;
    cattle_id: string;
    ear_tag: string;
    cattle_name?: string;

    diagnosis: string;
    diagnosis_date: Date;
    severity: 'MILD' | 'MODERATE' | 'SEVERE';
    status: 'ACTIVE' | 'RECOVERED' | 'DECEASED';

    symptoms?: string[];
    notes?: string;

    treatments?: Treatment[];

    created_at: Date;
    updated_at: Date;
    recorded_by?: string;
}

export interface Treatment {
    id: string;
    health_record_id: string;
    treatment_date: Date;
    product: string;
    dosage?: string;
    method?: 'INJECTION' | 'ORAL' | 'TOPICAL';
    administered_by?: string;
    notes?: string;

    withdrawal_period_days?: number;
    withdrawal_end_date?: Date;
}
