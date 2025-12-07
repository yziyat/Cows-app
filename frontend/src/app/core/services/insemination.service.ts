import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Insemination } from '../../models/insemination.model';

@Injectable({
    providedIn: 'root'
})
export class InseminationService {
    private collectionName = 'inseminations';

    constructor(private firestore: Firestore) { }

    getAllInseminations(): Observable<{ inseminations: Insemination[] }> {
        const collectionRef = collection(this.firestore, this.collectionName);
        return collectionData(collectionRef, { idField: 'id' }).pipe(
            map(data => ({ inseminations: data as Insemination[] }))
        );
    }

    getInsemination(id: number | string): Observable<{ insemination: Insemination }> {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return docData(docRef, { idField: 'id' }).pipe(
            map(data => ({ insemination: data as Insemination }))
        );
    }

    createInsemination(data: Partial<Insemination>): Observable<any> {
        const collectionRef = collection(this.firestore, this.collectionName);
        return from(addDoc(collectionRef, {
            ...data,
            created_at: new Date(),
            updated_at: new Date()
        }));
    }

    updateInsemination(id: number | string, data: Partial<Insemination>): Observable<any> {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return from(updateDoc(docRef, {
            ...data,
            updated_at: new Date()
        }));
    }

    deleteInsemination(id: number | string): Observable<any> {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return from(deleteDoc(docRef));
    }
}
