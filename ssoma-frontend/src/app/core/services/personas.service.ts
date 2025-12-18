import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PERSONAS_MOCK, Persona } from '../../mocks/personas.mock';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private STORAGE_KEY = 'ssoma_personas';

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.saveToStorage(PERSONAS_MOCK);
    }
  }

  private getFromStorage(): Persona[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(personas: Persona[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(personas));
  }

  getPersonas(): Observable<Persona[]> {
    return of(this.getFromStorage()).pipe(delay(100));
  }

  getPersonasByEmpresa(empresaId: number): Observable<Persona[]> {
    const personas = this.getFromStorage().filter(p => p.empresa_id === empresaId);
    return of(personas).pipe(delay(100));
  }

  getPersonaById(id: number): Observable<Persona | undefined> {
    const persona = this.getFromStorage().find(p => p.persona_id === id);
    return of(persona).pipe(delay(100));
  }

  createPersona(persona: Omit<Persona, 'persona_id'>): Observable<Persona> {
    const personas = this.getFromStorage();
    const newId = personas.length > 0 ? Math.max(...personas.map(p => p.persona_id)) + 1 : 1;
    const newPersona: Persona = {
      ...persona as Persona,
      persona_id: newId
    };
    personas.push(newPersona);
    this.saveToStorage(personas);
    return of(newPersona).pipe(delay(100));
  }

  updatePersona(id: number, persona: Partial<Persona>): Observable<Persona | null> {
    const personas = this.getFromStorage();
    const index = personas.findIndex(p => p.persona_id === id);
    
    if (index !== -1) {
      personas[index] = { ...personas[index], ...persona };
      this.saveToStorage(personas);
      return of(personas[index]).pipe(delay(100));
    }
    
    return of(null).pipe(delay(100));
  }

  deletePersona(id: number): Observable<boolean> {
    const personas = this.getFromStorage();
    const filtered = personas.filter(p => p.persona_id !== id);
    
    if (filtered.length !== personas.length) {
      this.saveToStorage(filtered);
      return of(true).pipe(delay(100));
    }
    
    return of(false).pipe(delay(100));
  }
}