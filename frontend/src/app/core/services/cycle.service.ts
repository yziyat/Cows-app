import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cycle {
    id: string;
    cattle_id: string;
    start_date: string;
    end_date?: string;
    status: string;
    observation?: string;
    cattle?: any;
}

@Injectable({
    providedIn: 'root'
})
export class CycleService {
    private apiUrl = `${environment.apiUrl}/cycles`;

    constructor(private http: HttpClient) { }

    getAllCycles(): Observable<Cycle[]> {
        return this.http.get<Cycle[]>(this.apiUrl);
    }

    getCycle(id: string): Observable<Cycle> {
        return this.http.get<Cycle>(`${this.apiUrl}/${id}`);
    }

    createCycle(data: Partial<Cycle>): Observable<Cycle> {
        return this.http.post<Cycle>(this.apiUrl, data);
    }

    updateCycle(id: string, data: Partial<Cycle>): Observable<Cycle> {
        return this.http.put<Cycle>(`${this.apiUrl}/${id}`, data);
    }

    deleteCycle(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
