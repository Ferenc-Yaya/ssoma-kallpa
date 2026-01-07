import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../mocks/empresas.mock';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private apiUrl = `${environment.apiUrl}/empresas`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getEmpresas(tenantId?: string): Observable<Empresa[]> {
    let params = new HttpParams();

    if (tenantId) {
      params = params.set('tenant', tenantId);
    }

    return this.http.get<Empresa[]>(this.apiUrl, { 
      headers: this.getHeaders(),
      params: params 
    });
  }

  getEmpresaById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createEmpresa(empresa: Omit<Empresa, 'id' | 'created_at'>): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa, { headers: this.getHeaders() });
  }

  updateEmpresa(id: number, empresa: Partial<Empresa>): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, empresa, { headers: this.getHeaders() });
  }

  deleteEmpresa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  searchEmpresas(searchTerm: string): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/search?q=${searchTerm}`, { headers: this.getHeaders() });
  }
}