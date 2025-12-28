import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  usuarioId: number;
  username: string;
  nombreCompleto: string;
  email: string;
  rolId?: number;
  rolNombre?: string;
  rolCodigo?: string;
  rol?: 'SUPER_ADMIN' | 'ADMIN_EMPRESA_PRINCIPAL' | 'ADMIN_CONTRATISTA';
  tenantId: string | null;
  empresaNombre?: string;
  activo: boolean;
  ultimoAcceso?: string;
  createdAt: string;
}

export interface CreateUsuarioRequest {
  username: string;
  password: string;
  nombreCompleto: string;
  email: string;
  rolId: number;
  tenantId?: string;
  empresaNombre?: string;
  activo?: boolean;
}

export interface UpdateUsuarioRequest {
  nombreCompleto: string;
  email: string;
  rolId: number;
  tenantId?: string;
  empresaNombre?: string;
  activo: boolean;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createUsuario(request: CreateUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, request, { headers: this.getHeaders() });
  }

  updateUsuario(id: number, request: UpdateUsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, request, { headers: this.getHeaders() });
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  changePassword(id: number, request: ChangePasswordRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/change-password`, request, { headers: this.getHeaders() });
  }

  toggleActivo(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/toggle-activo`, {}, { headers: this.getHeaders() });
  }
}
