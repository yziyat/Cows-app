// src/app/core/services/cattle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cattle, CattleListResponse } from '../../models/cattle.model';

@Injectable({
  providedIn: 'root'
})
export class CattleService {
  private apiUrl = `${environment.apiUrl}/cattle`;

  constructor(private http: HttpClient) {}

  getAllCattle(params?: {
    status?: string;
    sex?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Observable<CattleListResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.sex) httpParams = httpParams.set('sex', params.sex);
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.offset) httpParams = httpParams.set('offset', params.offset.toString());
    }

    return this.http.get<CattleListResponse>(this.apiUrl, { params: httpParams });
  }

  getCattleById(id: number): Observable<{ cattle: Cattle }> {
    return this.http.get<{ cattle: Cattle }>(`${this.apiUrl}/${id}`);
  }

  createCattle(cattle: Partial<Cattle>): Observable<{ message: string; cattle: Cattle }> {
    return this.http.post<{ message: string; cattle: Cattle }>(this.apiUrl, cattle);
  }

  updateCattle(id: number, cattle: Partial<Cattle>): Observable<{ message: string; cattle: Cattle }> {
    return this.http.put<{ message: string; cattle: Cattle }>(`${this.apiUrl}/${id}`, cattle);
  }

  deleteCattle(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
