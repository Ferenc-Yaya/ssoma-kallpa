import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { EMPRESAS_MOCK, Empresa } from '../../mocks/empresas.mock';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private STORAGE_KEY = 'ssoma_empresas';
  
  constructor() {
    // Inicializar LocalStorage si está vacío
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.saveToStorage(EMPRESAS_MOCK);
    }
  }

  private getFromStorage(): Empresa[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(empresas: Empresa[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(empresas));
  }

  getEmpresas(): Observable<Empresa[]> {
    return of(this.getFromStorage()).pipe(delay(100));
  }
  
  getEmpresaById(id: number): Observable<Empresa | undefined> {
    const empresa = this.getFromStorage().find(e => e.id === id);
    return of(empresa).pipe(delay(100));
  }

  createEmpresa(empresa: Omit<Empresa, 'id'>): Observable<Empresa> {
    const empresas = this.getFromStorage();
    const newId = empresas.length > 0 ? Math.max(...empresas.map(e => e.id)) + 1 : 1;
    const newEmpresa: Empresa = { ...empresa, id: newId };
    
    empresas.push(newEmpresa);
    this.saveToStorage(empresas);
    
    return of(newEmpresa).pipe(delay(100));
  }

  updateEmpresa(id: number, empresa: Partial<Empresa>): Observable<Empresa | null> {
    const empresas = this.getFromStorage();
    const index = empresas.findIndex(e => e.id === id);
    
    if (index === -1) {
      return of(null);
    }
    
    empresas[index] = { ...empresas[index], ...empresa };
    this.saveToStorage(empresas);
    
    return of(empresas[index]).pipe(delay(100));
  }

  deleteEmpresa(id: number): Observable<boolean> {
    const empresas = this.getFromStorage();
    const filteredEmpresas = empresas.filter(e => e.id !== id);
    
    if (filteredEmpresas.length === empresas.length) {
      return of(false);
    }
    
    this.saveToStorage(filteredEmpresas);
    return of(true).pipe(delay(100));
  }
}