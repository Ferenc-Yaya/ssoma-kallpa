import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private currentTenant: string = 'KALLPA'; // Por defecto

  getCurrentTenant(): string {
    return this.currentTenant;
  }

  setTenant(tenantId: string): void {
    this.currentTenant = tenantId;
  }
}