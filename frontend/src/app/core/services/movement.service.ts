import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable, from, map, forkJoin, switchMap } from 'rxjs';
import { Movement } from '../../models/pen.model';
import { PenService } from './pen.service';
import { CattleService } from './cattle.service';

@Injectable({
    providedIn: 'root'
})
export class MovementService {
    private collectionName = 'movements';

    constructor(
        private firestore: Firestore,
        private penService: PenService,
        private cattleService: CattleService
    ) { }

    recordMovement(movement: Movement): Observable<string> {
        const movementsCollection = collection(this.firestore, this.collectionName);

        return from(addDoc(movementsCollection, {
            ...movement,
            moved_at: movement.moved_at || new Date()
        })).pipe(
            map(docRef => docRef.id),
            switchMap(movementId => {
                // Update cattle pen
                const updateCattle$ = this.cattleService.updateCattle(movement.cattle_id, {
                    pen: movement.to_pen_name || movement.to_pen_id
                });

                // Update pen occupancies
                const updates: Observable<void>[] = [updateCattle$];

                if (movement.from_pen_id) {
                    updates.push(this.penService.updateOccupancy(movement.from_pen_id, -1));
                }
                updates.push(this.penService.updateOccupancy(movement.to_pen_id, 1));

                return forkJoin(updates).pipe(map(() => movementId));
            })
        );
    }

    getMovementHistory(cattleId: string): Observable<Movement[]> {
        const movementsCollection = collection(this.firestore, this.collectionName);
        const q = query(
            movementsCollection,
            where('cattle_id', '==', cattleId),
            orderBy('moved_at', 'desc')
        );
        return collectionData(q, { idField: 'id' }) as Observable<Movement[]>;
    }

    getPenMovements(penId: string): Observable<Movement[]> {
        const movementsCollection = collection(this.firestore, this.collectionName);
        const q = query(
            movementsCollection,
            where('to_pen_id', '==', penId),
            orderBy('moved_at', 'desc'),
            limit(50)
        );
        return collectionData(q, { idField: 'id' }) as Observable<Movement[]>;
    }

    getRecentMovements(limitCount: number = 20): Observable<Movement[]> {
        const movementsCollection = collection(this.firestore, this.collectionName);
        const q = query(
            movementsCollection,
            orderBy('moved_at', 'desc'),
            limit(limitCount)
        );
        return collectionData(q, { idField: 'id' }) as Observable<Movement[]>;
    }
}
