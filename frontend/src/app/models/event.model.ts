export type EventType = 'HEAT' | 'BREED' | 'PREG_CHECK' | 'DRY' | 'FRESH' | 'MOVE' | 'VACCINE' | 'HOOF_TRIM';

export interface CattleEvent {
    id?: string;
    cattle_id: string;
    event_type: EventType;
    event_date: Date;
    recorded_at: Date;
    recorded_by?: string;

    // Common fields
    notes?: string;

    // Breed specific
    sire_id?: string;
    technician?: string;

    // Preg Check specific
    result?: 'PREGNANT' | 'OPEN' | 'RECHECK';
    days_pregnant?: number;

    // Move specific
    old_group?: string;
    new_group?: string;

    // Health specific or other details
    details?: any;
}
