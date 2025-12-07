import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { HealthRecord } from '../../models/health.model';

@Injectable({
    providedIn: 'root'
})
export class HealthService {
    private collectionName = 'health_records';

    constructor(private firestore: Firestore) { }

    getAllRecords(): Observable<{ records: HealthRecord[] }> {
        const recordsCollection = collection(this.firestore, this.collectionName);
        return collectionData(recordsCollection, { idField: 'id' }).pipe(
            map(data => ({ records: data as HealthRecord[] }))
        );
    }

    getActiveRecords(): Observable<{ records: HealthRecord[] }> {
        // Ideally query firestore, filtering client side for simplicity
        const recordsCollection = collection(this.firestore, this.collectionName);
        return collectionData(recordsCollection, { idField: 'id' }).pipe(
            map(data => {
                const records = data as HealthRecord[];
                return { records: records.filter(r => r.status === 'ACTIVE') };
            })
        );
    }

    getRecordById(id: string): Observable<HealthRecord> {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return docData(docRef, { idField: 'id' }).pipe(
            map(data => data as HealthRecord)
        );
    }

    createRecord(record: Partial<HealthRecord>): Observable<any> {
        const collectionRef = collection(this.firestore, this.collectionName);
        return from(addDoc(collectionRef, {
            ...record,
            created_at: new Date(),
            updated_at: new Date()
        }));
    }

    updateRecord(id: string, record: Partial<HealthRecord>): Observable<any> {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return from(updateDoc(docRef, {
            ...record,
            updated_at: new Date()
        }));
    }

    // Treatments could be subcollection or array in record. Using array for now as per model.
    addTreatment(recordId: string, treatment: any): Observable<any> {
        // Need to fetch record, add to array, update.
        // Or simpler: just use updateRecord if we have the array locally.
        // For now, assume UI handles modifying the treatments array and calls updateRecord.
        return from(Promise.resolve());
    }
}
