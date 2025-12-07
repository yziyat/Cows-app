// src/app/core/services/protocol.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { SynchronizationProtocol, ProtocolWithSteps } from '../../models/protocol.model';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  private collectionName = 'protocols';

  constructor(private firestore: Firestore) { }

  getAllProtocols(): Observable<{ protocols: SynchronizationProtocol[] }> {
    const protocolsCollection = collection(this.firestore, this.collectionName);
    return collectionData(protocolsCollection, { idField: 'id' }).pipe(
      map(data => ({ protocols: data as SynchronizationProtocol[] }))
    );
  }

  getProtocolById(id: number | string): Observable<ProtocolWithSteps> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(
      map(data => ({
        protocol: data as SynchronizationProtocol,
        steps: [] // Mock steps for now or fetch subcollection
      }))
    );
  }

  createProtocol(protocol: any): Observable<any> {
    const collectionRef = collection(this.firestore, this.collectionName);
    return from(addDoc(collectionRef, {
      ...protocol,
      created_at: new Date(),
      updated_at: new Date()
    }));
  }

  updateProtocol(id: number | string, protocol: any): Observable<any> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(updateDoc(docRef, {
      ...protocol,
      updated_at: new Date()
    }));
  }

  deleteProtocol(id: number | string): Observable<any> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(deleteDoc(docRef));
  }
}
