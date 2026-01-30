import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface EmpresaDTO {
  id: string;
  tenantId: string;
  ruc: string;
  razonSocial: string;
  tipoId: string;
  tipoNombre: string;
  direccion: string;
  telefono: string;
  email: string;
  logoUrl: string;
  sitioWeb: string;
  rubroComercial: string;
  scoreSeguridad: number;
  activo: boolean;
  createdAt: string;
  contactos?: any[];
}

export interface Contacto {
  nombreCompleto: string;
  cargo?: string;
  telefono?: string;
  email?: string;
}

export interface CreateEmpresaRequest {
  ruc: string;
  razonSocial: string;
  tipoId: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logoUrl?: string;
  sitioWeb?: string;
  rubroComercial?: string;
  scoreSeguridad?: number;
  contactos?: Contacto[];
  tenantId: string;
  activo: boolean;
}

export interface UpdateEmpresaRequest {
  ruc?: string;
  razonSocial?: string;
  tipoId?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
  logoUrl?: string;
  sitioWeb?: string;
  rubroComercial?: string;
  scoreSeguridad?: number;
  contactos?: Contacto[];
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${environment.apiUrl}/empresas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las empresas del tenant actual
   */
  getAllEmpresas(tenantId?: string): Observable<EmpresaDTO[]> {
    console.log('🌐 Llamando a API:', this.apiUrl);
    console.log('🆔 TenantId recibido:', tenantId);
    const params: any = {};
    if (tenantId) {
      params.tenant = tenantId;
      console.log('📤 Parámetros a enviar:', params);
    }
    return this.http.get<EmpresaDTO[]>(this.apiUrl, { params }).pipe(
      tap(response => console.log('✅ Respuesta del servidor:', response))
    );
  }

  /**
   * Obtiene solo las empresas principales (tipo='HOST')
   */
  getEmpresasPrincipales(): Observable<EmpresaDTO[]> {
    return this.http.get<EmpresaDTO[]>(this.apiUrl);
    // El filtrado por tipo se hará en el componente hasta que haya endpoint específico
  }

  /**
   * Obtiene una empresa por ID
   */
  getEmpresaById(id: string): Observable<EmpresaDTO> {
    return this.http.get<EmpresaDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva empresa
   */
  createEmpresa(request: CreateEmpresaRequest): Observable<EmpresaDTO> {
    // Enviar el header X-Tenant-ID con el tenant donde se crea la empresa
    const headers = { 'X-Tenant-ID': request.tenantId };
    return this.http.post<EmpresaDTO>(this.apiUrl, request, { headers });
  }

  /**
   * Actualiza una empresa existente
   */
  updateEmpresa(id: string, request: UpdateEmpresaRequest): Observable<EmpresaDTO> {
    return this.http.put<EmpresaDTO>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Elimina una empresa
   */
  deleteEmpresa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cambia el estado activo/inactivo de una empresa
   */
  toggleEstado(id: string, activo: boolean): Observable<EmpresaDTO> {
    return this.http.put<EmpresaDTO>(`${this.apiUrl}/${id}`, { activo });
  }

  /**
   * Busca empresas por texto
   */
  searchEmpresas(query: string): Observable<EmpresaDTO[]> {
    return this.http.get<EmpresaDTO[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}
