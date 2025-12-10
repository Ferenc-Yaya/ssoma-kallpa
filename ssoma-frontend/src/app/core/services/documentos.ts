import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DOCUMENTOS_MOCK, Documento } from '../../mocks/documentos.mock';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private STORAGE_KEY = 'ssoma_documentos';

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.saveToStorage(DOCUMENTOS_MOCK);
    }
  }

  private getFromStorage(): Documento[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(documentos: Documento[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documentos));
  }

  getDocumentos(): Observable<Documento[]> {
    return of(this.getFromStorage()).pipe(delay(100));
  }

  getDocumentoById(id: number): Observable<Documento | undefined> {
    const documento = this.getFromStorage().find(d => d.id === id);
    return of(documento).pipe(delay(100));
  }

  updateEstado(id: number, estado: Documento['estado'], observaciones?: string): Observable<Documento | null> {
    const documentos = this.getFromStorage();
    const index = documentos.findIndex(d => d.id === id);

    if (index === -1) {
      return of(null);
    }

    documentos[index] = {
      ...documentos[index],
      estado,
      observaciones: observaciones || documentos[index].observaciones
    };
    
    this.saveToStorage(documentos);
    return of(documentos[index]).pipe(delay(100));
  }
}