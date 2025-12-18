import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  tenantId: string;
  rol: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/api/auth';
  
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.saveToken(response.token);
          this.saveTenantId(response.tenantId);
          this.saveUsername(response.username);
          this.saveRole(response.rol);
        })
      );
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  saveTenantId(tenantId: string): void {
    localStorage.setItem('current_tenant', tenantId);
  }

  getTenantId(): string | null {
    return localStorage.getItem('current_tenant');
  }

  saveUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  saveRole(rol: string): void {
    localStorage.setItem('rol', rol);
  }

  getRole(): string | null {
    return localStorage.getItem('rol');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_tenant');
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(roleName: string): boolean {
    return this.getRole() === roleName;
  }

  isSuperAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN');
  }

  isEmpresaPrincipal(): boolean {
    return this.hasRole('ADMIN_EMPRESA_PRINCIPAL');
  }

  isContratista(): boolean {
    return this.hasRole('ADMIN_CONTRATISTA');
  }
}