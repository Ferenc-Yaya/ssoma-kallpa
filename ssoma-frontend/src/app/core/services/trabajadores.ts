import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TRABAJADORES_MOCK, Trabajador } from '../../mocks/trabajadores.mock';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {
  private STORAGE_KEY = 'ssoma_trabajadores';

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.saveToStorage(TRABAJADORES_MOCK);
    }
  }

  private getFromStorage(): Trabajador[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(trabajadores: Trabajador[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trabajadores));
  }

  getTrabajadores(): Observable<Trabajador[]> {
    return of(this.getFromStorage()).pipe(delay(100));
  }

  getTrabajadorById(id: number): Observable<Trabajador | undefined> {
    const trabajador = this.getFromStorage().find(t => t.id === id);
    return of(trabajador).pipe(delay(100));
  }

  getTrabajadorByDni(dni: string): Observable<Trabajador | undefined> {
    const trabajador = this.getFromStorage().find(t => t.dni === dni);
    return of(trabajador).pipe(delay(100));
  }
}