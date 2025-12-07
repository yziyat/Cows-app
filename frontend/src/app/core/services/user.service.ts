import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private collectionName = 'users';

    constructor(private firestore: Firestore) { }

    getAllUsers(): Observable<User[]> {
        const usersCollection = collection(this.firestore, this.collectionName);
        return collectionData(usersCollection, { idField: 'uid' }) as Observable<User[]>;
    }

    updateUserRole(uid: string, role: 'admin' | 'editor' | 'viewer'): Observable<void> {
        const userDoc = doc(this.firestore, `${this.collectionName}/${uid}`);
        return from(updateDoc(userDoc, { role }));
    }
}
