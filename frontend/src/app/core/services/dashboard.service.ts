import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, combineLatest, map } from 'rxjs';
import { DashboardStats } from '../../models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private firestore: Firestore) { }

    getStats(): Observable<{ stats: DashboardStats }> {
        const cattleColl = collection(this.firestore, 'cattle');
        const cyclesColl = collection(this.firestore, 'cycles');
        const inseminationsColl = collection(this.firestore, 'inseminations');

        const activeCyclesQuery = query(cyclesColl, where('status', 'in', ['planned', 'in_progress']));
        const pendingInsemQuery = query(inseminationsColl, where('result', '==', 'pending'));
        const pregnantQuery = query(inseminationsColl, where('result', '==', 'pregnant'));

        return combineLatest([
            collectionData(cattleColl),
            collectionData(activeCyclesQuery),
            collectionData(pendingInsemQuery),
            collectionData(pregnantQuery)
        ]).pipe(
            map(([cattle, cycles, pending, pregnant]) => {
                return {
                    stats: {
                        total_cattle: cattle.length,
                        active_cycles: cycles.length,
                        pending_inseminations: pending.length,
                        pregnant_cattle: pregnant.length
                    }
                };
            })
        );
    }
}
