import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, writeBatch, getDocs } from '@angular/fire/firestore';
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

  async batchUpsertCattle(cattleList: Partial<Cattle>[]): Promise<void> {
    const cattleCollection = collection(this.firestore, this.collectionName);

    // 1. Get all existing cattle to check for duplicates/updates
    // Optimized: Only fetch ID and ear_tag if possible, but Firestore client fetches whole docs usually.
    const snapshot = await getDocs(cattleCollection);
    const existingMap = new Map<string, string>(); // ear_tag -> doc_id

    snapshot.forEach(doc => {
      const data = doc.data() as Cattle;
      if (data.ear_tag) {
        existingMap.set(data.ear_tag, doc.id);
      }
    });

    // 2. Process in chunks of 500 (Firestore batch limit)
    const chunkSize = 500;
    for (let i = 0; i < cattleList.length; i += chunkSize) {
      const chunk = cattleList.slice(i, i + chunkSize);
      const batch = writeBatch(this.firestore);

      chunk.forEach(cow => {
        if (!cow.ear_tag) return;

        const existingId = existingMap.get(cow.ear_tag);

        if (existingId) {
          // Update
          const docRef = doc(this.firestore, `${this.collectionName}/${existingId}`);
          batch.update(docRef, { ...cow, updated_at: new Date() });
        } else {
          // Create
          // We can use a custom ID or let Firestore auto-gen. 
          // If we want to use ear_tag as ID, we could: doc(cattleCollection, cow.ear_tag)
          // But existing logic uses auto IDs. sticking to auto IDs.
          const newDocRef = doc(cattleCollection);
          batch.set(newDocRef, { ...cow, created_at: new Date(), updated_at: new Date() });
        }
      });

      await batch.commit();
    }
  }
}
