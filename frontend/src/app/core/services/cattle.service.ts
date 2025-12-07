// src/app/core/services/cattle.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Cattle, CattleListResponse } from '../../models/cattle.model';

@Injectable({
  providedIn: 'root'
})
export class CattleService {
  private collectionName = 'cattle';

  constructor(private firestore: Firestore) { }

  getAllCattle(params?: any): Observable<CattleListResponse> {
    const cattleCollection = collection(this.firestore, this.collectionName);
    // Note: Complex filtering (like search/pagination) needs advanced Firestore queries
    // For now, we fetch all and filter client-side if needed, since dataset is likely small
    return collectionData(cattleCollection, { idField: 'id' }).pipe(
      map(data => {
        const cattle = data as Cattle[];
        return {
          cattle: cattle,
          total: cattle.length,
          limit: cattle.length,
          offset: 0
        };
      })
    );
  }

  getCattleById(id: number | string): Observable<{ cattle: Cattle }> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(
      map(data => ({ cattle: data as Cattle }))
    );
  }

  createCattle(cattle: Partial<Cattle>): Observable<any> {
    const cattleCollection = collection(this.firestore, this.collectionName);
    return from(addDoc(cattleCollection, {
      ...cattle,
      created_at: new Date(),
      updated_at: new Date()
    }));
  }

  updateCattle(id: number | string, cattle: Partial<Cattle>): Observable<any> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(updateDoc(docRef, {
      ...cattle,
      updated_at: new Date()
    }));
  }

  deleteCattle(id: number | string): Observable<any> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(deleteDoc(docRef));
  }
}
