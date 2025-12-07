export interface WorkListItem {
    cattle_id: string;
    cattle_name: string;
    ear_tag: string;
    task_type: 'INJECTION' | 'VET_CHECK' | 'HEAT_CHECK' | 'DRY_OFF' | 'CALVING';
    description: string;
    due_date: Date;
    status: 'PENDING' | 'COMPLETED' | 'SKIPPED';

    // Context details
    protocol_name?: string;
    product_name?: string;
    days_in_milk?: number;
    breeding_date?: Date; // For vet check logic

    // Action tracking
    action_id?: string; // Link to CycleAction or specific event requirement
}

export interface DailyWorkLists {
    date: Date;
    injections: WorkListItem[];
    vet_checks: WorkListItem[];
    heat_checks: WorkListItem[];
}
