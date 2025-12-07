import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Insemination {
    id: string;
    cattle_id: string;
    date: string;
    bull_id?: string;
    success?: boolean;
    notes?: string;
    cattle?: any;
}

@Injectable({
    providedIn: 'root'
})
export class InseminationService {
    private apiUrl = `${environment.apiUrl}/inseminations`;

    constructor(private http: HttpClient) { }

    getAllInseminations(): Observable<Insemination[]> {
        return this.http.get<Insemination[]>(this.apiUrl);
    }

    getInsemination(id: string): Observable<Insemination> {
        return this.http.get<Insemination>(`${this.apiUrl}/${id}`);
    }

    createInsemination(data: Partial<Insemination>): Observable<Insemination> {
        return this.http.post<Insemination>(this.apiUrl, data);
    }

    updateInsemination(id: string, data: Partial<Insemination>): Observable<Insemination> {
        return this.http.put<Insemination>(`${this.apiUrl}/${id}`, data);
    }

    deleteInsemination(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
