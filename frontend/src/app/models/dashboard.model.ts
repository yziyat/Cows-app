// src/app/models/dashboard.model.ts
export interface DashboardStats {
    total_cattle: number;
    active_cycles: number;
    pending_inseminations: number;
    pregnant_cattle: number;
    // Work Lists
    injections_today?: number;
    vet_checks_pending?: number;
    heat_checks_today?: number;
}
