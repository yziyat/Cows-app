import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';
import { Pen } from '../../models/pen.model';

@Injectable({
    providedIn: 'root'
})
export class PenService {
    private collectionName = 'pens';

    constructor(private firestore: Firestore) { }

    getAllPens(): Observable<Pen[]> {
        const pensCollection = collection(this.firestore, this.collectionName);
        return collectionData(pensCollection, { idField: 'id' }) as Observable<Pen[]>;
    }

    getActivePens(): Observable<Pen[]> {
        return this.getAllPens().pipe(
            map(pens => pens.filter(p => p.status === 'active'))
        );
    }

    getPenById(id: string): Observable<Pen> {
        const penDoc = doc(this.firestore, `${this.collectionName}/${id}`);
        return docData(penDoc, { idField: 'id' }) as Observable<Pen>;
    }

    createPen(pen: Pen): Observable<string> {
        const pensCollection = collection(this.firestore, this.collectionName);
        const penData = {
            ...pen,
            current_occupancy: 0,
            created_at: new Date(),
            updated_at: new Date()
        };
        return from(addDoc(pensCollection, penData)).pipe(
            map(docRef => docRef.id)
        );
    }

    updatePen(id: string, pen: Partial<Pen>): Observable<void> {
        const penDoc = doc(this.firestore, `${this.collectionName}/${id}`);
        return from(updateDoc(penDoc, { ...pen, updated_at: new Date() }));
    }

    deletePen(id: string): Observable<void> {
        const penDoc = doc(this.firestore, `${this.collectionName}/${id}`);
        return from(deleteDoc(penDoc));
    }

    updateOccupancy(penId: string, delta: number): Observable<void> {
        return this.getPenById(penId).pipe(
            switchMap(pen => {
                const newOccupancy = (pen.current_occupancy || 0) + delta;
                return this.updatePen(penId, { current_occupancy: newOccupancy });
            })
        );
    }

    getPenOccupancy(penId: string): Observable<{ pen: Pen, cattle_count: number }> {
        return this.getPenById(penId).pipe(
            map(pen => ({
                pen,
                cattle_count: pen.current_occupancy || 0
            }))
        );
    }
}
