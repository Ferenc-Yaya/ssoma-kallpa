import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Rol {
  rolId: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  nivelJerarquia: number;
  requiereTenant: boolean;
  cantidadUsuarios: number;
  activo: boolean;
  createdAt: string;
}

export interface CreateRolRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  nivelJerarquia: number;
  requiereTenant: boolean;
  activo?: boolean;
}

export interface UpdateRolRequest {
  nombre: string;
  descripcion: string;
  nivelJerarquia: number;
  requiereTenant: boolean;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getRolById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getRolByCodigo(codigo: string): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/codigo/${codigo}`, { headers: this.getHeaders() });
  }

  createRol(request: CreateRolRequest): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, request, { headers: this.getHeaders() });
  }

  updateRol(id: number, request: UpdateRolRequest): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, request, { headers: this.getHeaders() });
  }

  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  toggleActivo(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/toggle-activo`, {}, { headers: this.getHeaders() });
  }
}
