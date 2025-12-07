import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, Timestamp } from '@angular/fire/firestore';
import { Observable, combineLatest, map, of } from 'rxjs';
import { DailyWorkLists, WorkListItem } from '../../models/work-list.model';
import { CycleService } from './cycle.service';
import { InseminationService } from './insemination.service';
// import { CattleService } from './cattle.service'; // Assuming exists, otherwise use firestore direct

@Injectable({
    providedIn: 'root'
})
export class WorkListService {

    constructor(
        private firestore: Firestore,
        private cycleService: CycleService,
        private inseminationService: InseminationService
    ) { }

    getDailyWorkLists(date: Date = new Date()): Observable<DailyWorkLists> {
        // 1. Get Injections (from cycle_actions)
        // Note: Assuming 'cycle_actions' is a root collection for easy querying, or we'd need collectionGroup
        // For now, let's try to query a 'cycle_actions' collection. 
        // If it doesn't exist, this will return empty.
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const actionsRef = collection(this.firestore, 'cycle_actions');
        // Simple query: scheduled_date is today. Filtering client side for now to avoid index issues
        const actions$ = collectionData(actionsRef, { idField: 'id' }).pipe(
            map((actions: any[]) => {
                return actions
                    .filter(a => {
                        const d = a.scheduled_date instanceof Timestamp ? a.scheduled_date.toDate() : new Date(a.scheduled_date);
                        return d >= startOfDay && d <= endOfDay && !a.is_completed;
                    })
                    .map(a => ({
                        cattle_id: a.cattle_id, // Might need to fetch cattle name
                        cattle_name: a.cattle_name || 'Unknown',
                        ear_tag: a.ear_tag || '?',
                        task_type: 'INJECTION' as const,
                        description: `Injection: ${a.product || 'Hormone'}`,
                        due_date: a.scheduled_date instanceof Timestamp ? a.scheduled_date.toDate() : new Date(a.scheduled_date),
                        status: 'PENDING' as const,
                        action_id: a.id
                    }));
            })
        );

        // 2. Get Vet Checks (Inseminations pending check)
        // Logic: Inseminations > 30 days ago, result 'pending'
        const vetChecks$ = this.inseminationService.getAllInseminations().pipe(
            map(response => {
                const today = new Date();
                return response.inseminations
                    .filter(i => i.result === 'pending')
                    .filter(i => {
                        const insDate = i.insemination_date instanceof Timestamp ? (i.insemination_date as any).toDate() : new Date(i.insemination_date);
                        const diffDays = Math.floor((today.getTime() - insDate.getTime()) / (1000 * 3600 * 24));
                        return diffDays >= 30; // Check after 30 days
                    })
                    .map(i => ({
                        cattle_id: i.cattle_id.toString(),
                        cattle_name: i.cattle_name || 'Cow',
                        ear_tag: i.ear_tag || '?',
                        task_type: 'VET_CHECK' as const,
                        description: 'Pregnancy Check due',
                        due_date: new Date(),
                        status: 'PENDING' as const
                    }));
            })
        );

        // 3. Heat Checks (Mock logic for now - active cows not pregnant)
        const heatChecks$ = of([] as WorkListItem[]); // specific logic needs cattle service

        return combineLatest([actions$, vetChecks$, heatChecks$]).pipe(
            map(([injections, vetChecks, heatChecks]) => ({
                date: date,
                injections,
                vet_checks: vetChecks,
                heat_checks: heatChecks
            }))
        );
    }
}
