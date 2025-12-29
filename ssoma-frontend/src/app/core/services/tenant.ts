import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  getCurrentTenant(): string {
    // Obtener del localStorage (guardado por AuthService al hacer login)
    return localStorage.getItem('current_tenant') || 'SYSTEM';
  }

  setTenant(tenantId: string): void {
    localStorage.setItem('current_tenant', tenantId);
  }
}