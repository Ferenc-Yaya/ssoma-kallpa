import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SedeDTO {
  id: string;
  empresaId: string;
  tenantId: string;
  nombre: string;
  direccion: string;
  esPrincipal: boolean;
  activo: boolean;
  createdAt: string;
}

export interface CreateSedeRequest {
  empresaId: string;
  nombre: string;
  direccion: string;
  esPrincipal: boolean;
  activo: boolean;
}

export interface UpdateSedeRequest {
  nombre?: string;
  direccion?: string;
  esPrincipal?: boolean;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private apiUrl = `${environment.apiUrl}/sedes`;

  constructor(private http: HttpClient) {}

  getSedesByEmpresa(empresaId: string): Observable<SedeDTO[]> {
    return this.http.get<SedeDTO[]>(`${this.apiUrl}/empresa/${empresaId}`);
  }

  countSedesByEmpresa(empresaId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/empresa/${empresaId}/count`);
  }

  createSede(request: CreateSedeRequest): Observable<SedeDTO> {
    return this.http.post<SedeDTO>(this.apiUrl, request);
  }

  updateSede(id: string, request: UpdateSedeRequest): Observable<SedeDTO> {
    return this.http.put<SedeDTO>(`${this.apiUrl}/${id}`, request);
  }

  deleteSede(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
