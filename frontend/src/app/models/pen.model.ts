export interface Pen {
    id?: string;
    name: string;
    location: string;
    capacity: number;
    type: 'maternity' | 'milking' | 'dry' | 'heifer' | 'isolation' | 'general';
    status: 'active' | 'maintenance' | 'inactive';
    current_occupancy?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface Movement {
    id?: string;
    cattle_id: string;
    cattle_ear_tag?: string;
    from_pen_id?: string;
    from_pen_name?: string;
    to_pen_id: string;
    to_pen_name?: string;
    moved_at: Date;
    moved_by: string;
    moved_by_name?: string;
    reason?: string;
    notes?: string;
}
