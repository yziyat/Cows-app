// src/app/core/services/protocol.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SynchronizationProtocol, ProtocolWithSteps } from '../../models/protocol.model';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  private apiUrl = `${environment.apiUrl}/protocols`;

  constructor(private http: HttpClient) {}

  getAllProtocols(): Observable<{ protocols: SynchronizationProtocol[] }> {
    return this.http.get<{ protocols: SynchronizationProtocol[] }>(this.apiUrl);
  }

  getProtocolById(id: number): Observable<ProtocolWithSteps> {
    return this.http.get<ProtocolWithSteps>(`${this.apiUrl}/${id}`);
  }

  createProtocol(protocol: any): Observable<{ message: string; protocol: SynchronizationProtocol }> {
    return this.http.post<{ message: string; protocol: SynchronizationProtocol }>(this.apiUrl, protocol);
  }
}

// =====================================

// src/app/core/services/cycle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SynchronizationCycle } from '../../models/cycle.model';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  private apiUrl = `${environment.apiUrl}/cycles`;

  constructor(private http: HttpClient) {}

  getAllCycles(params?: {
    status?: string;
    cattle_id?: number;
  }): Observable<{ cycles: SynchronizationCycle[] }> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.cattle_id) httpParams = httpParams.set('cattle_id', params.cattle_id.toString());
    }

    return this.http.get<{ cycles: SynchronizationCycle[] }>(this.apiUrl, { params: httpParams });
  }

  createCycle(cycle: any): Observable<{ message: string; cycle: SynchronizationCycle }> {
    return this.http.post<{ message: string; cycle: SynchronizationCycle }>(this.apiUrl, cycle);
  }
}

// =====================================

// src/app/core/services/insemination.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Insemination } from '../../models/insemination.model';

@Injectable({
  providedIn: 'root'
})
export class InseminationService {
  private apiUrl = `${environment.apiUrl}/inseminations`;

  constructor(private http: HttpClient) {}

  getAllInseminations(params?: {
    cattle_id?: number;
    result?: string;
  }): Observable<{ inseminations: Insemination[] }> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.cattle_id) httpParams = httpParams.set('cattle_id', params.cattle_id.toString());
      if (params.result) httpParams = httpParams.set('result', params.result);
    }

    return this.http.get<{ inseminations: Insemination[] }>(this.apiUrl, { params: httpParams });
  }

  createInsemination(insemination: any): Observable<{ message: string; insemination: Insemination }> {
    return this.http.post<{ message: string; insemination: Insemination }>(this.apiUrl, insemination);
  }
}

// =====================================

// src/app/core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats } from '../../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<{ stats: DashboardStats }> {
    return this.http.get<{ stats: DashboardStats }>(`${this.apiUrl}/stats`);
  }
}
