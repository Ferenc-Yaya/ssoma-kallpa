import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SustanciaPeligrosa {
  sustanciaId?: number;
  tenantId?: string;
  nombre: string;
  codigoUn?: string;
  clasePeligro?: string;
  descripcion?: string;
  hojaSeguridadUrl?: string;
  createdAt?: string;
}

export interface InventarioMatpel {
  inventarioId?: number;
  tenantId?: string;
  empresaId: number;
  sustanciaId: number;
  sustanciaNombre?: string;
  codigoUn?: string;
  clasePeligro?: string;
  cantidad: number;
  unidadMedida?: string;
  ubicacion?: string;
  fechaIngreso: string;
  lote?: string;
  estado?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialesPeligrososService {
  private sustanciasUrl = `${environment.apiUrl}/sustancias-peligrosas`;
  private inventarioUrl = `${environment.apiUrl}/inventario-matpel`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ============ SUSTANCIAS PELIGROSAS ============

  getAllSustancias(): Observable<SustanciaPeligrosa[]> {
    return this.http.get<SustanciaPeligrosa[]>(this.sustanciasUrl, { headers: this.getHeaders() });
  }

  getSustanciaById(id: number): Observable<SustanciaPeligrosa> {
    return this.http.get<SustanciaPeligrosa>(`${this.sustanciasUrl}/${id}`, { headers: this.getHeaders() });
  }

  createSustancia(sustancia: Omit<SustanciaPeligrosa, 'sustanciaId' | 'tenantId' | 'createdAt'>): Observable<SustanciaPeligrosa> {
    return this.http.post<SustanciaPeligrosa>(this.sustanciasUrl, sustancia, { headers: this.getHeaders() });
  }

  updateSustancia(id: number, sustancia: Partial<SustanciaPeligrosa>): Observable<SustanciaPeligrosa> {
    return this.http.put<SustanciaPeligrosa>(`${this.sustanciasUrl}/${id}`, sustancia, { headers: this.getHeaders() });
  }

  deleteSustancia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.sustanciasUrl}/${id}`, { headers: this.getHeaders() });
  }

  searchSustancias(searchTerm: string): Observable<SustanciaPeligrosa[]> {
    return this.http.get<SustanciaPeligrosa[]>(`${this.sustanciasUrl}/search?q=${searchTerm}`, { headers: this.getHeaders() });
  }

  getSustanciasByClase(clasePeligro: string): Observable<SustanciaPeligrosa[]> {
    return this.http.get<SustanciaPeligrosa[]>(`${this.sustanciasUrl}/clase/${clasePeligro}`, { headers: this.getHeaders() });
  }

  // ============ INVENTARIO MATPEL ============

  getAllInventarios(): Observable<InventarioMatpel[]> {
    return this.http.get<InventarioMatpel[]>(this.inventarioUrl, { headers: this.getHeaders() });
  }

  getInventarioById(id: number): Observable<InventarioMatpel> {
    return this.http.get<InventarioMatpel>(`${this.inventarioUrl}/${id}`, { headers: this.getHeaders() });
  }

  getInventariosByEmpresa(empresaId: number): Observable<InventarioMatpel[]> {
    return this.http.get<InventarioMatpel[]>(`${this.inventarioUrl}/empresa/${empresaId}`, { headers: this.getHeaders() });
  }

  createInventario(inventario: Omit<InventarioMatpel, 'inventarioId' | 'tenantId' | 'createdAt' | 'sustanciaNombre' | 'codigoUn' | 'clasePeligro'>): Observable<InventarioMatpel> {
    return this.http.post<InventarioMatpel>(this.inventarioUrl, inventario, { headers: this.getHeaders() });
  }

  updateInventario(id: number, inventario: Partial<InventarioMatpel>): Observable<InventarioMatpel> {
    return this.http.put<InventarioMatpel>(`${this.inventarioUrl}/${id}`, inventario, { headers: this.getHeaders() });
  }

  deleteInventario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.inventarioUrl}/${id}`, { headers: this.getHeaders() });
  }

  searchInventarios(searchTerm: string): Observable<InventarioMatpel[]> {
    return this.http.get<InventarioMatpel[]>(`${this.inventarioUrl}/search?q=${searchTerm}`, { headers: this.getHeaders() });
  }

  getInventariosByEstado(estado: string): Observable<InventarioMatpel[]> {
    return this.http.get<InventarioMatpel[]>(`${this.inventarioUrl}/estado/${estado}`, { headers: this.getHeaders() });
  }
}
