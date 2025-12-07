import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SynchronizationCycle } from '../../models/cycle.model';

@Injectable({
    providedIn: 'root'
})
export class CycleService {
    private apiUrl = `${environment.apiUrl}/cycles`;

    constructor(private http: HttpClient) { }

    getAllCycles(): Observable<{ cycles: SynchronizationCycle[] }> {
        return this.http.get<{ cycles: SynchronizationCycle[] }>(this.apiUrl);
    }

    getCycle(id: number): Observable<{ cycle: SynchronizationCycle }> {
        return this.http.get<{ cycle: SynchronizationCycle }>(`${this.apiUrl}/${id}`);
    }

    createCycle(data: Partial<SynchronizationCycle>): Observable<{ message: string; cycle: SynchronizationCycle }> {
        return this.http.post<{ message: string; cycle: SynchronizationCycle }>(this.apiUrl, data);
    }

    updateCycle(id: number, data: Partial<SynchronizationCycle>): Observable<{ message: string; cycle: SynchronizationCycle }> {
        return this.http.put<{ message: string; cycle: SynchronizationCycle }>(`${this.apiUrl}/${id}`, data);
    }

    deleteCycle(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}
