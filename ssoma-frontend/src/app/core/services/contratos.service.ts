import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Contrato, CONTRATOS_MOCK } from '../../mocks/contratos.mock';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private contratos: Contrato[] = [...CONTRATOS_MOCK];

  constructor() {}

  getContratos(): Observable<Contrato[]> {
    return of(this.contratos).pipe(delay(100));
  }

  getContratoById(id: number): Observable<Contrato | undefined> {
    const contrato = this.contratos.find(c => c.contrato_id === id);
    return of(contrato).pipe(delay(100));
  }

  getContratoByNumero(numeroContrato: string): Observable<Contrato | undefined> {
    const contrato = this.contratos.find(c => 
      c.numero_contrato.toLowerCase().includes(numeroContrato.toLowerCase())
    );
    return of(contrato).pipe(delay(100));
  }

  getContratoByQRCode(qrCode: string): Observable<Contrato | undefined> {
    const contrato = this.contratos.find(c => c.qr_code === qrCode);
    return of(contrato).pipe(delay(100));
  }

  getContratosByEmpresa(empresaId: number): Observable<Contrato[]> {
    const contratos = this.contratos.filter(c => c.empresa_id === empresaId);
    return of(contratos).pipe(delay(100));
  }

  createContrato(contrato: Partial<Contrato>): Observable<Contrato> {
    const nuevoContrato: Contrato = {
      contrato_id: this.contratos.length + 1,
      tenant_id: 'KALLPA',
      qr_code: `QR-CONT-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...contrato
    } as Contrato;
    
    this.contratos.push(nuevoContrato);
    return of(nuevoContrato).pipe(delay(100));
  }

  updateContrato(id: number, updates: Partial<Contrato>): Observable<Contrato | undefined> {
    const index = this.contratos.findIndex(c => c.contrato_id === id);
    if (index !== -1) {
      this.contratos[index] = { ...this.contratos[index], ...updates };
      return of(this.contratos[index]).pipe(delay(100));
    }
    return of(undefined).pipe(delay(100));
  }

  deleteContrato(id: number): Observable<boolean> {
    const index = this.contratos.findIndex(c => c.contrato_id === id);
    if (index !== -1) {
      this.contratos.splice(index, 1);
      return of(true).pipe(delay(100));
    }
    return of(false).pipe(delay(100));
  }
}