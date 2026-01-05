import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TipoContratista {
  tipoId: string;
  codigo: string;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiposContratistaService {
  private apiUrl = `${environment.apiUrl}/tipos-contratista`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoContratista[]> {
    return this.http.get<TipoContratista[]>(this.apiUrl);
  }
}
