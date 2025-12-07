export interface Cattle {
    id: number | string;
    id: number | string;
    ear_tag: string; // ID
    breed?: string;
    birth_date?: Date; // BDAT
    sex: 'male' | 'female'; // GENDR
    status: 'active' | 'sold' | 'deceased' | 'culled';
    weight?: number;
    notes?: string;

    // Production & Reproduction Fields
    pen?: string; // PEN
    electronic_id?: string; // EID
    breed_code?: string; // CBRD
    repro_status?: string; // RPRO
    lactation_number?: number; // LACT
    days_in_milk?: number; // DIM
    first_bred_date?: Date; // FDAT
    days_carried_calf?: number; // DCC
    last_heat_date?: Date; // HDAT
    days_since_last_heat?: number; // DSLH
    times_bred?: number; // TBRD
    sire1?: string; // SIR1
    sire2?: string; // SIR2
    sire3?: string; // SIR3
    days_open?: number; // DOPN
    due_date?: Date; // DUE
    calving_interval?: number; // CINT
    age_days?: number; // AGEDS

    created_at: Date;
    updated_at: Date;
}

export interface CattleListResponse {
    cattle: Cattle[];
    total: number;
    limit: number;
    offset: number;
}
