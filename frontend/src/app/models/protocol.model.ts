// src/app/models/protocol.model.ts
export interface SynchronizationProtocol {
    id: number;
    name: string;
    description?: string;
    duration_days: number;
    is_active: boolean;
    steps_count?: number;
    created_by?: number;
    created_by_name?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ProtocolStep {
    id: number;
    protocol_id: number;
    step_number: number;
    day_number: number;
    action: string;
    product?: string;
    dosage?: string;
    notes?: string;
}

export interface ProtocolWithSteps {
    protocol: SynchronizationProtocol;
    steps: ProtocolStep[];
}
