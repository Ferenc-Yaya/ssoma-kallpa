import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Rol {
  rolId: string;
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

  getAllRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  getRolById(id: string): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`);
  }

  getRolByCodigo(codigo: string): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/codigo/${codigo}`);
  }

  createRol(request: CreateRolRequest): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, request);
  }

  updateRol(id: string, request: UpdateRolRequest): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, request);
  }

  deleteRol(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleActivo(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/toggle-activo`, {});
  }
}
