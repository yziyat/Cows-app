import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, docData, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { SynchronizationCycle, CycleAction } from '../../models/cycle.model';
import { SynchronizationProtocol } from '../../models/protocol.model';

@Injectable({
    providedIn: 'root'
})
export class CycleService {
    private collectionName = 'cycles';
    private actionsCollectionName = 'cycle_actions';

    constructor(private firestore: Firestore) { }

    getAllCycles(): Observable<{ cycles: SynchronizationCycle[] }> {
        const collectionRef = collection(this.firestore, this.collectionName);
        return collectionData(collectionRef, { idField: 'id' }).pipe(
            map(data => ({ cycles: data as SynchronizationCycle[] }))
        );
    }

    getCycle(id: number | string): Observable<{ cycle: SynchronizationCycle }> {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return docData(docRef, { idField: 'id' }).pipe(
            map(data => ({ cycle: data as SynchronizationCycle }))
        );
    }

    createCycle(data: Partial<SynchronizationCycle>, protocolSteps: any[] = []): Observable<any> {
        const collectionRef = collection(this.firestore, this.collectionName);

        // Return Observable that creates cycle then actions
        return from(addDoc(collectionRef, {
            ...data,
            created_at: new Date(),
            updated_at: new Date()
        })).pipe(
            // After cycle created, create actions
            map(docRef => {
                if (protocolSteps && protocolSteps.length > 0 && data.start_date) {
                    this.createCycleActions(docRef.id, data, protocolSteps);
                }
                return docRef;
            })
        );
    }

    private createCycleActions(cycleId: string, cycleData: Partial<SynchronizationCycle>, steps: any[]) {
        const actionsRef = collection(this.firestore, this.actionsCollectionName);
        const startDate = new Date(cycleData.start_date!);

        steps.forEach(step => {
            const scheduledDate = new Date(startDate);
            scheduledDate.setDate(startDate.getDate() + (step.day_number || 0));

            addDoc(actionsRef, {
                cycle_id: cycleId,
                cattle_id: cycleData.cattle_id,
                cattle_name: cycleData.cattle_name,
                ear_tag: cycleData.ear_tag,
                step_id: step.id,
                description: step.action,
                product: step.product,
                scheduled_date: scheduledDate,
                is_completed: false,
                created_at: new Date()
            });
        });
    }

    updateCycle(id: number | string, data: Partial<SynchronizationCycle>): Observable<any> {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return from(updateDoc(docRef, {
            ...data,
            updated_at: new Date()
        }));
    }

    deleteCycle(id: number | string): Observable<any> {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return from(deleteDoc(docRef));
    }

    // Bulk Creation
    batchCreateCycles(protocol: SynchronizationProtocol, startDate: Date, cattleList: { ear_tag: string }[]): Observable<number> {
        const promises = cattleList.map(cattle => {
            const cycleData: Partial<SynchronizationCycle> = {
                protocol_id: protocol.id,
                protocol_name: protocol.name,
                ear_tag: cattle.ear_tag,
                cattle_id: cattle.ear_tag,
                status: 'planned',
                start_date: startDate
            };
            return this.createCycle(cycleData, protocol.steps || []);
        });

        return from(Promise.all(promises)).pipe(
            map(results => results.length)
        );
    }
}
