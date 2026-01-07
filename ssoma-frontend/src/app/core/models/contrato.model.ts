/**
 * Modelos de Contrato - Tipos estrictos
 */

import {
  EstadoContrato,
  NivelRiesgo,
  EstadoAcreditacion
} from '../enums';

// ============================================================================
// CONTRATO
// ============================================================================

/**
 * Contrato - Entidad principal
 * Representa un contrato entre empresa principal y contratista
 */
export interface Contrato {
  // Identificadores - REQUERIDOS
  contratoId: string;                // UUID
  tenantId: string;                  // UUID
  empresaId: string;                 // UUID - FK a Empresa contratista

  // Datos del Contrato - REQUERIDOS
  numeroContrato: string;            // Número único de contrato
  numeroOc: string;                  // Número de Orden de Compra
  descripcionServicio: string;       // Descripción del servicio contratado

  // Fechas - REQUERIDAS
  fechaInicio: Date;
  fechaFin: Date;

  // Clasificación - REQUERIDOS
  nivelRiesgo: NivelRiesgo;          // Enum: BAJO, MEDIO, ALTO, MUY_ALTO
  actividadesCriticas: string[];     // Array de actividades (nunca undefined)

  // Responsables - Pueden ser null si no están asignados aún
  adminContratoKallpaId: string | null;  // ID del administrador de Kallpa
  adminContratoKallpaNombre: string | null;  // Desnormalizado para performance

  // Supervisores - Arrays vacíos por defecto
  supervisoresEhsIds: string[];      // IDs de supervisores EHS
  administradoresContratoIds: string[];  // IDs de administradores del contrato

  // Financiero - REQUERIDO
  montoTotal: number;                // Monto en soles

  // Estado - REQUERIDOS
  estado: EstadoContrato;            // Enum: VIGENTE, VENCIDO, SUSPENDIDO
  estadoAcreditacion: EstadoAcreditacion;  // Enum: PENDIENTE, APTO, OBSERVADO

  // Códigos y Referencias - Pueden ser null
  qrCode: string | null;             // Código QR generado

  // Auditoría - REQUERIDOS
  createdAt: Date;
  updatedAt: Date;

  // Datos desnormalizados para performance (pueden ser null si no se cargan)
  empresaNombre: string | null;      // Nombre de la empresa contratista
  empresaRuc: string | null;         // RUC de la empresa contratista
}

/**
 * DTO para crear Contrato
 */
export interface CreateContratoDto {
  tenantId: string;
  empresaId: string;
  numeroContrato: string;
  numeroOc: string;
  descripcionServicio: string;
  fechaInicio: Date;
  fechaFin: Date;
  nivelRiesgo: NivelRiesgo;
  actividadesCriticas: string[];
  adminContratoKallpaId: string | null;
  supervisoresEhsIds: string[];
  administradoresContratoIds: string[];
  montoTotal: number;
}

/**
 * DTO para actualizar Contrato
 */
export interface UpdateContratoDto {
  numeroContrato?: string;
  numeroOc?: string;
  descripcionServicio?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  nivelRiesgo?: NivelRiesgo;
  actividadesCriticas?: string[];
  adminContratoKallpaId?: string | null;
  supervisoresEhsIds?: string[];
  administradoresContratoIds?: string[];
  montoTotal?: number;
  estado?: EstadoContrato;
}

/**
 * Contrato para listados - Con datos agregados
 */
export interface ContratoListItem {
  contratoId: string;
  numeroContrato: string;
  numeroOc: string;
  empresaNombre: string;
  empresaRuc: string;
  descripcionServicio: string;
  fechaInicio: Date;
  fechaFin: Date;
  nivelRiesgo: NivelRiesgo;
  estado: EstadoContrato;
  estadoAcreditacion: EstadoAcreditacion;
  montoTotal: number;
  cantidadTrabajadores: number;      // Agregado
  cantidadDocumentosAprobados: number;  // Agregado
  cantidadDocumentosObservados: number; // Agregado
  diasRestantes: number;             // Calculado
}

/**
 * Filtros para búsqueda de contratos
 */
export interface ContratoFilters {
  tenantId?: string;
  empresaId?: string;
  estado?: EstadoContrato;
  estadoAcreditacion?: EstadoAcreditacion;
  nivelRiesgo?: NivelRiesgo;
  fechaInicioDesde?: Date;
  fechaInicioHasta?: Date;
  fechaFinDesde?: Date;
  fechaFinHasta?: Date;
  searchTerm?: string;               // Busca en número contrato, OC, empresa
}

/**
 * Documento aprobado dentro de un contrato
 * Para tracking de documentos específicos del contrato
 */
export interface DocumentoAprobadoContrato {
  documentoId: string;
  tipoDocumento: string;
  nombreArchivo: string;
  fechaAprobacion: Date;
  fechaVencimiento: Date | null;
  aprobadoPor: string;
}
