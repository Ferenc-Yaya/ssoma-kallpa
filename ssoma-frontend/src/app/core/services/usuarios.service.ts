import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  usuarioId: string;
  username: string;
  nombreCompleto: string;
  email: string;
  rolId?: string;
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
  rolId: string;
  tenantId?: string;
  empresaNombre?: string;
  activo?: boolean;
}

export interface UpdateUsuarioRequest {
  nombreCompleto: string;
  email: string;
  rolId: string;
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

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(request: CreateUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, request);
  }

  updateUsuario(id: string, request: UpdateUsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, request);
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changePassword(id: string, request: ChangePasswordRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/change-password`, request);
  }

  toggleActivo(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/toggle-activo`, {});
  }
}
