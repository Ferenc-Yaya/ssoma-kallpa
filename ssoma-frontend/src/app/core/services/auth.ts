import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USER, LoginRequest, LoginResponse } from '../../mocks/auth.mock';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Simula validación (datos mock)
    if (credentials.username === MOCK_USER.username && 
        credentials.password === MOCK_USER.password) {
      // Simula delay de red (300ms)
      return of(MOCK_USER.response).pipe(delay(300));
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
