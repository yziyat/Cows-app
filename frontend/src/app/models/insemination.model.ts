// src/app/models/insemination.model.ts
export interface Insemination {
    id: number | string;
    cattle_id: number | string;
    insemination_date: Date;
    heat_observation_id?: number | string;
    cycle_id?: number | string;
    bull_name?: string;
    bull_registration?: string;
    technician_name?: string;
    straw_number?: string;
    result: 'pending' | 'pregnant' | 'open' | 'aborted';
    pregnancy_check_date?: Date;
    expected_calving_date?: Date;
    ear_tag?: string;
    cattle_name?: string;
    notes?: string;
    performed_by?: number | string;
    performed_by_name?: string;
    created_at: Date;
    updated_at: Date;
    // Compatibility fields for form/frontend
    date?: Date;
    bull_id?: string;
    success?: boolean;
}
