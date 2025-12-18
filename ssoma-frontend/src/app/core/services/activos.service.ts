import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Activo, ACTIVOS_MOCK } from '../../mocks/activos.mock';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {
  private activos: Activo[] = [...ACTIVOS_MOCK];
  private nextId: number = 9;

  constructor() {}

  // Obtener todos los activos
  getActivos(): Observable<Activo[]> {
    return of(this.activos).pipe(delay(100));
  }

  // Obtener activos por empresa
  getActivosByEmpresa(empresaId: number): Observable<Activo[]> {
    const activos = this.activos.filter(a => a.empresa_id === empresaId);
    return of(activos).pipe(delay(100));
  }

  // Obtener activos por tipo
  getActivosByTipo(empresaId: number, tipo: 'VEHICULO' | 'HERRAMIENTA'): Observable<Activo[]> {
    const activos = this.activos.filter(a => 
      a.empresa_id === empresaId && a.tipo_activo === tipo
    );
    return of(activos).pipe(delay(100));
  }

  // Obtener activo por ID
  getActivoById(activoId: number): Observable<Activo | undefined> {
    const activo = this.activos.find(a => a.activo_id === activoId);
    return of(activo).pipe(delay(100));
  }

  // Crear nuevo activo
  createActivo(activo: Omit<Activo, 'activo_id' | 'created_at'>): Observable<Activo> {
    const nuevoActivo: Activo = {
      ...activo,
      activo_id: this.nextId++,
      created_at: new Date().toISOString().split('T')[0]
    };
    this.activos.push(nuevoActivo);
    return of(nuevoActivo).pipe(delay(100));
  }

  // Actualizar activo
  updateActivo(activoId: number, updates: Partial<Activo>): Observable<Activo | undefined> {
    const index = this.activos.findIndex(a => a.activo_id === activoId);
    if (index !== -1) {
      this.activos[index] = { ...this.activos[index], ...updates };
      return of(this.activos[index]).pipe(delay(100));
    }
    return of(undefined).pipe(delay(100));
  }

  // Eliminar activo
  deleteActivo(activoId: number): Observable<boolean> {
    const index = this.activos.findIndex(a => a.activo_id === activoId);
    if (index !== -1) {
      this.activos.splice(index, 1);
      return of(true).pipe(delay(100));
    }
    return of(false).pipe(delay(100));
  }

  // Cambiar estado de activo
  cambiarEstado(activoId: number, nuevoEstado: 'OPERATIVO' | 'MANTENIMIENTO' | 'FUERA_SERVICIO'): Observable<Activo | undefined> {
    return this.updateActivo(activoId, { estado: nuevoEstado });
  }

  // Obtener estadísticas por empresa
  getEstadisticasByEmpresa(empresaId: number): Observable<{
    total: number;
    vehiculos: number;
    herramientas: number;
    operativos: number;
    mantenimiento: number;
    fuera_servicio: number;
  }> {
    const activosEmpresa = this.activos.filter(a => a.empresa_id === empresaId);
    
    const stats = {
      total: activosEmpresa.length,
      vehiculos: activosEmpresa.filter(a => a.tipo_activo === 'VEHICULO').length,
      herramientas: activosEmpresa.filter(a => a.tipo_activo === 'HERRAMIENTA').length,
      operativos: activosEmpresa.filter(a => a.estado === 'OPERATIVO').length,
      mantenimiento: activosEmpresa.filter(a => a.estado === 'MANTENIMIENTO').length,
      fuera_servicio: activosEmpresa.filter(a => a.estado === 'FUERA_SERVICIO').length
    };

    return of(stats).pipe(delay(100));
  }
}