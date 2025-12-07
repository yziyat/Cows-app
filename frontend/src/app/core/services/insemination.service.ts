import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Insemination } from '../../models/insemination.model';

@Injectable({
    providedIn: 'root'
})
export class InseminationService {
    private apiUrl = `${environment.apiUrl}/inseminations`;

    constructor(private http: HttpClient) { }

    getAllInseminations(): Observable<{ inseminations: Insemination[] }> {
        return this.http.get<{ inseminations: Insemination[] }>(this.apiUrl);
    }

    getInsemination(id: number): Observable<{ insemination: Insemination }> {
        return this.http.get<{ insemination: Insemination }>(`${this.apiUrl}/${id}`);
    }

    createInsemination(data: Partial<Insemination>): Observable<{ message: string; insemination: Insemination }> {
        return this.http.post<{ message: string; insemination: Insemination }>(this.apiUrl, data);
    }

    updateInsemination(id: number, data: Partial<Insemination>): Observable<{ message: string; insemination: Insemination }> {
        return this.http.put<{ message: string; insemination: Insemination }>(`${this.apiUrl}/${id}`, data);
    }

    deleteInsemination(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}
