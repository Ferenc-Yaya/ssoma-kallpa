import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  ContratoAcreditacion, 
  CONTRATOS_ACREDITACION_MOCK,
  DocumentoAcreditacion 
} from '../../mocks/acreditacion.mock';

@Injectable({
  providedIn: 'root'
})
export class AcreditacionService {
  private contratos: ContratoAcreditacion[] = [...CONTRATOS_ACREDITACION_MOCK];

  constructor() {}

  // Obtener todos los contratos pendientes de acreditación
  getContratosPendientes(): Observable<ContratoAcreditacion[]> {
    return of(this.contratos).pipe(delay(100));
  }

  // Obtener contrato por ID con todos sus recursos
  getContratoById(contratoId: number): Observable<ContratoAcreditacion | undefined> {
    const contrato = this.contratos.find(c => c.contrato_id === contratoId);
    return of(contrato).pipe(delay(100));
  }

  // Aprobar documento
  aprobarDocumento(
    contratoId: number,
    documentoId: number,
    revisorNombre: string
  ): Observable<boolean> {
    const contrato = this.contratos.find(c => c.contrato_id === contratoId);
    if (!contrato) return of(false);

    // Buscar documento en personas
    for (const persona of contrato.personas) {
      const doc = persona.documentos.find(d => d.documento_id === documentoId);
      if (doc) {
        doc.estado_revision = 'APROBADO';
        doc.fecha_revision = new Date().toISOString();
        doc.revisor_nombre = revisorNombre;
        doc.motivo_rechazo = undefined;
        this.recalcularProgreso(contrato);
        return of(true).pipe(delay(100));
      }
    }

    // Buscar documento en activos
    for (const activo of contrato.activos) {
      const doc = activo.documentos.find(d => d.documento_id === documentoId);
      if (doc) {
        doc.estado_revision = 'APROBADO';
        doc.fecha_revision = new Date().toISOString();
        doc.revisor_nombre = revisorNombre;
        doc.motivo_rechazo = undefined;
        this.recalcularProgreso(contrato);
        return of(true).pipe(delay(100));
      }
    }

    // Buscar documento en materiales
    for (const material of contrato.materiales) {
      const doc = material.documentos.find(d => d.documento_id === documentoId);
      if (doc) {
        doc.estado_revision = 'APROBADO';
        doc.fecha_revision = new Date().toISOString();
        doc.revisor_nombre = revisorNombre;
        doc.motivo_rechazo = undefined;
        this.recalcularProgreso(contrato);
        return of(true).pipe(delay(100));
      }
    }

    return of(false);
  }

  // Rechazar documento
  rechazarDocumento(
    contratoId: number,
    documentoId: number,
    motivo: string,
    revisorNombre: string
  ): Observable<boolean> {
    const contrato = this.contratos.find(c => c.contrato_id === contratoId);
    if (!contrato) return of(false);

    // Buscar documento en personas
    for (const persona of contrato.personas) {
      const doc = persona.documentos.find(d => d.documento_id === documentoId);
      if (doc) {
        doc.estado_revision = 'RECHAZADO';
        doc.fecha_revision = new Date().toISOString();
        doc.revisor_nombre = revisorNombre;
        doc.motivo_rechazo = motivo;
        this.recalcularProgreso(contrato);
        return of(true).pipe(delay(100));
      }
    }

    // Buscar documento en activos
    for (const activo of contrato.activos) {
      const doc = activo.documentos.find(d => d.documento_id === documentoId);
      if (doc) {
        doc.estado_revision = 'RECHAZADO';
        doc.fecha_revision = new Date().toISOString();
        doc.revisor_nombre = revisorNombre;
        doc.motivo_rechazo = motivo;
        this.recalcularProgreso(contrato);
        return of(true).pipe(delay(100));
      }
    }

    // Buscar documento en materiales
    for (const material of contrato.materiales) {
      const doc = material.documentos.find(d => d.documento_id === documentoId);
      if (doc) {
        doc.estado_revision = 'RECHAZADO';
        doc.fecha_revision = new Date().toISOString();
        doc.revisor_nombre = revisorNombre;
        doc.motivo_rechazo = motivo;
        this.recalcularProgreso(contrato);
        return of(true).pipe(delay(100));
      }
    }

    return of(false);
  }

  // Recalcular progreso del contrato
  private recalcularProgreso(contrato: ContratoAcreditacion): void {
    let aprobados = 0;
    let rechazados = 0;
    let pendientes = 0;
    let totales = 0;

    // Contar documentos de personas
    contrato.personas.forEach(persona => {
      persona.documentos.forEach(doc => {
        totales++;
        if (doc.estado_revision === 'APROBADO') aprobados++;
        else if (doc.estado_revision === 'RECHAZADO') rechazados++;
        else pendientes++;
      });
    });

    // Contar documentos de activos
    contrato.activos.forEach(activo => {
      activo.documentos.forEach(doc => {
        totales++;
        if (doc.estado_revision === 'APROBADO') aprobados++;
        else if (doc.estado_revision === 'RECHAZADO') rechazados++;
        else pendientes++;
      });
    });

    // Contar documentos de materiales
    contrato.materiales.forEach(material => {
      material.documentos.forEach(doc => {
        totales++;
        if (doc.estado_revision === 'APROBADO') aprobados++;
        else if (doc.estado_revision === 'RECHAZADO') rechazados++;
        else pendientes++;
      });
    });

    contrato.progreso = {
      docs_aprobados: aprobados,
      docs_rechazados: rechazados,
      docs_pendientes: pendientes,
      docs_totales: totales,
      porcentaje: totales > 0 ? Math.round((aprobados / totales) * 100) : 0
    };

    // Actualizar estado de acreditación del contrato
    if (rechazados > 0) {
      contrato.estado_acreditacion = 'OBSERVADO';
    } else if (pendientes === 0 && aprobados === totales) {
      contrato.estado_acreditacion = 'APTO';
    } else {
      contrato.estado_acreditacion = 'PENDIENTE';
    }
  }

  // Obtener todos los documentos del contrato (para búsqueda rápida)
  getAllDocumentosFromContrato(contrato: ContratoAcreditacion): DocumentoAcreditacion[] {
    const docs: DocumentoAcreditacion[] = [];

    contrato.personas.forEach(persona => {
      docs.push(...persona.documentos);
    });

    contrato.activos.forEach(activo => {
      docs.push(...activo.documentos);
    });

    contrato.materiales.forEach(material => {
      docs.push(...material.documentos);
    });

    return docs;
  }
}