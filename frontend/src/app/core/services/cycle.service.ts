import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { SynchronizationCycle } from '../../models/cycle.model';

@Injectable({
    providedIn: 'root'
})
export class CycleService {
    private collectionName = 'cycles';

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

    createCycle(data: Partial<SynchronizationCycle>): Observable<any> {
        const collectionRef = collection(this.firestore, this.collectionName);
        return from(addDoc(collectionRef, {
            ...data,
            created_at: new Date(),
            updated_at: new Date()
        }));
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
}
