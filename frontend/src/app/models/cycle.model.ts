// src/app/models/cycle.model.ts
export interface SynchronizationCycle {
    id: number | string;
    cattle_id: number | string;
    protocol_id: number | string;
    start_date: Date;
    expected_heat_date?: Date;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    ear_tag?: string;
    cattle_name?: string;
    protocol_name?: string;
    notes?: string;
    created_by?: number | string;
    created_by_name?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CycleAction {
    id: number | string;
    cycle_id: number | string;
    step_id: number | string;
    scheduled_date: Date;
    completed_date?: Date;
    is_completed: boolean;
    performed_by?: number | string;
    notes?: string;
    created_at: Date;
}
