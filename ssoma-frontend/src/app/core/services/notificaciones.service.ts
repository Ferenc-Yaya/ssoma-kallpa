import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NOTIFICACIONES_MOCK, Notificacion } from '../../mocks/notificaciones.mock';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private STORAGE_KEY = 'ssoma_notificaciones';
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$ = this.notificacionesSubject.asObservable();

  constructor() {
    this.loadNotificaciones();
  }

  private loadNotificaciones(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const notificaciones = stored ? JSON.parse(stored) : NOTIFICACIONES_MOCK;
    this.notificacionesSubject.next(notificaciones);
  }

  private saveNotificaciones(notificaciones: Notificacion[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notificaciones));
    this.notificacionesSubject.next(notificaciones);
  }

  getNotificaciones(): Observable<Notificacion[]> {
    return this.notificaciones$;
  }

  getNotificacionesNoLeidas(): Observable<Notificacion[]> {
    const notificaciones = this.notificacionesSubject.value;
    return of(notificaciones.filter(n => !n.leida));
  }

  getCountNoLeidas(): number {
    return this.notificacionesSubject.value.filter(n => !n.leida).length;
  }

  marcarComoLeida(id: number): void {
    const notificaciones = this.notificacionesSubject.value.map(n => 
      n.id === id ? { ...n, leida: true } : n
    );
    this.saveNotificaciones(notificaciones);
  }

  marcarTodasComoLeidas(): void {
    const notificaciones = this.notificacionesSubject.value.map(n => 
      ({ ...n, leida: true })
    );
    this.saveNotificaciones(notificaciones);
  }

  eliminarNotificacion(id: number): void {
    const notificaciones = this.notificacionesSubject.value.filter(n => n.id !== id);
    this.saveNotificaciones(notificaciones);
  }
}