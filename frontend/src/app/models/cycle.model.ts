// src/app/models/cycle.model.ts
export interface SynchronizationCycle {
    id: number;
    cattle_id: number;
    protocol_id: number;
    start_date: Date;
    expected_heat_date?: Date;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    ear_tag?: string;
    cattle_name?: string;
    protocol_name?: string;
    notes?: string;
    created_by?: number;
    created_by_name?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CycleAction {
    id: number;
    cycle_id: number;
    step_id: number;
    scheduled_date: Date;
    completed_date?: Date;
    is_completed: boolean;
    performed_by?: number;
    notes?: string;
    created_at: Date;
}
