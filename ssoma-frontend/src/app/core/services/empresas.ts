import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa, CreateEmpresaDto, UpdateEmpresaDto } from '../models/empresa.model';
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

  getEmpresaById(id: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createEmpresa(empresa: CreateEmpresaDto): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa, { headers: this.getHeaders() });
  }

  updateEmpresa(id: string, empresa: UpdateEmpresaDto): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, empresa, { headers: this.getHeaders() });
  }

  deleteEmpresa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  searchEmpresas(searchTerm: string): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/search?q=${searchTerm}`, { headers: this.getHeaders() });
  }
}