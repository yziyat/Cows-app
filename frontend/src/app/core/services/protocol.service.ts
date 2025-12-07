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

  constructor(private http: HttpClient) { }

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


