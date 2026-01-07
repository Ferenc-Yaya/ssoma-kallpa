/**
 * Modelos de Documento - Tipos estrictos
 */

import {
  TipoEntidad,
  EstadoDocumento,
  EstadoValidacion,
  PeriodicidadDocumento
} from '../enums';

// ============================================================================
// DOCUMENTO REQUERIBLE (Catálogo)
// ============================================================================

/**
 * Documento Requerible - Catálogo maestro de documentos
 * Define qué documentos se requieren para cada tipo de entidad
 */
export interface DocumentoRequerible {
  // Identificadores - REQUERIDOS
  docReqId: string;                  // UUID
  tenantId: string;                  // UUID

  // Clasificación - REQUERIDOS
  codigoInterno: string;             // Código único (ej: "SCTR", "LICENCIA_CONDUCIR")
  nombreMostrar: string;             // Nombre para mostrar al usuario
  categoria: string;                 // Categoría (ej: "Seguros", "Licencias", "Certificados")

  // Aplicabilidad - REQUERIDOS
  aplicaA: TipoEntidad[];            // Array de tipos de entidad (EMPRESA, PERSONA, ACTIVO, etc)
  esObligatorio: boolean;            // Si es obligatorio o opcional

  // Vigencia - REQUERIDOS
  tieneVencimiento: boolean;         // Si el documento vence
  periodicidad: PeriodicidadDocumento | null;  // Con qué frecuencia se renueva
  diasAlertaVencimiento: number;     // Días antes de vencer para alertar

  // Validación - REQUERIDOS
  requiereAprobacion: boolean;       // Si requiere aprobación manual
  formatosPermitidos: string[];      // Formatos de archivo permitidos (PDF, JPG, etc)
  tamanioMaximoMb: number;          // Tamaño máximo en MB

  // Descripción - REQUERIDO
  descripcion: string;               // Descripción detallada
  instrucciones: string | null;      // Instrucciones para cargar el documento

  // Estado - REQUERIDO
  activo: boolean;

  // Auditoría - REQUERIDOS
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear Documento Requerible
 */
export interface CreateDocumentoRequeribleDto {
  tenantId: string;
  codigoInterno: string;
  nombreMostrar: string;
  categoria: string;
  aplicaA: TipoEntidad[];
  esObligatorio: boolean;
  tieneVencimiento: boolean;
  periodicidad: PeriodicidadDocumento | null;
  diasAlertaVencimiento: number;
  requiereAprobacion: boolean;
  formatosPermitidos: string[];
  tamanioMaximoMb: number;
  descripcion: string;
  instrucciones: string | null;
}

// ============================================================================
// DOCUMENTO (Instancia cargada)
// ============================================================================

/**
 * Documento - Instancia de un documento cargado
 * Polimórfico: puede pertenecer a Empresa, Persona, Activo, Material, Contrato
 */
export interface Documento {
  // Identificadores - REQUERIDOS
  documentoId: string;               // UUID
  tenantId: string;                  // UUID

  // Polimorfismo - A quién pertenece - REQUERIDOS
  entidadId: string;                 // UUID de la entidad dueña
  entidadTipo: TipoEntidad;          // Enum: EMPRESA, PERSONA, ACTIVO, MATERIAL, CONTRATO

  // Relación con Catálogo - REQUERIDO
  docReqId: string;                  // UUID - FK a DocumentoRequerible

  // Archivo - REQUERIDOS
  nombreArchivo: string;             // Nombre original del archivo
  rutaArchivo: string;               // Ruta en el storage
  archivoUrl: string;                // URL pública para acceso
  tamanioBytes: number;              // Tamaño del archivo en bytes
  mimeType: string;                  // Tipo MIME (application/pdf, image/jpeg, etc)

  // Fechas - fechaEmision es REQUERIDA, vencimiento depende del tipo
  fechaEmision: Date;                // Fecha de emisión del documento
  fechaVencimiento: Date | null;     // Fecha de vencimiento (null si no vence)

  // Estado - REQUERIDOS
  estado: EstadoDocumento;           // Enum: VIGENTE, VENCIDO, POR_VENCER, NO_PRESENTADO
  estadoValidacion: EstadoValidacion;  // Enum: PENDIENTE, APROBADO, RECHAZADO, OBSERVADO

  // Validación - Pueden ser null si aún no se validó
  validadoPorId: string | null;      // UUID del usuario que validó
  validadoPorNombre: string | null;  // Desnormalizado
  fechaValidacion: Date | null;      // Fecha de validación/rechazo
  observaciones: string | null;      // Observaciones del validador

  // Versión - Para control de versiones
  version: number;                   // Número de versión (1, 2, 3, ...)
  documentoPadreId: string | null;   // UUID del documento anterior (si es una actualización)

  // Auditoría - REQUERIDOS
  creadoPorId: string;               // Usuario que cargó el documento
  creadoPorNombre: string;           // Desnormalizado
  createdAt: Date;
  updatedAt: Date;

  // Datos desnormalizados para performance (pueden ser null si no se cargan)
  docReqNombre: string | null;       // Nombre del tipo de documento
  entidadNombre: string | null;      // Nombre de la entidad dueña
}

/**
 * DTO para crear Documento
 */
export interface CreateDocumentoDto {
  tenantId: string;
  entidadId: string;
  entidadTipo: TipoEntidad;
  docReqId: string;
  nombreArchivo: string;
  archivoUrl: string;                // Ya subido previamente
  tamanioBytes: number;
  mimeType: string;
  fechaEmision: Date;
  fechaVencimiento: Date | null;
  creadoPorId: string;
}

/**
 * DTO para actualizar Documento (cambiar estado de validación)
 */
export interface ValidarDocumentoDto {
  estadoValidacion: EstadoValidacion;
  observaciones: string | null;
  validadoPorId: string;
}

/**
 * Documento para listados - Con datos agregados
 */
export interface DocumentoListItem {
  documentoId: string;
  docReqNombre: string;
  nombreArchivo: string;
  archivoUrl: string;
  entidadNombre: string;
  entidadTipo: TipoEntidad;
  fechaEmision: Date;
  fechaVencimiento: Date | null;
  estado: EstadoDocumento;
  estadoValidacion: EstadoValidacion;
  diasParaVencer: number | null;     // Calculado
  version: number;
}

// ============================================================================
// ESTADO DE CUMPLIMIENTO
// ============================================================================

/**
 * Estado de Cumplimiento - Resumen del cumplimiento documental de una entidad
 * Calcula automáticamente si una entidad está apta según sus documentos
 */
export interface EstadoCumplimiento {
  // Identificadores - REQUERIDOS
  estadoId: string;                  // UUID
  entidadId: string;                 // UUID de la entidad
  entidadTipo: TipoEntidad;          // Enum: EMPRESA, PERSONA, ACTIVO, etc

  // Resultado - REQUERIDO
  esApto: boolean;                   // Si cumple con todos los requisitos
  colorSemaforo: ColorSemaforo;      // Enum: VERDE, AMBAR, ROJO

  // Contadores - REQUERIDOS (nunca undefined)
  documentosRequeridos: number;      // Total de documentos requeridos
  documentosVigentes: number;        // Documentos vigentes y aprobados
  documentosVencidos: number;        // Documentos vencidos
  documentosPorVencer: number;       // Documentos que vencen pronto
  documentosFaltantes: number;       // Documentos no presentados
  documentosObservados: number;      // Documentos rechazados u observados

  // Porcentaje de cumplimiento - REQUERIDO
  porcentajeCumplimiento: number;    // 0-100

  // Auditoría - REQUERIDOS
  ultimaActualizacion: Date;         // Última vez que se recalculó
  proximaRevision: Date;             // Próxima fecha de revisión automática
}

/**
 * Enum para colores de semáforo
 */
export enum ColorSemaforo {
  VERDE = 'VERDE',       // Todo en orden (100% cumplimiento)
  AMBAR = 'AMBAR',       // Advertencia (documentos por vencer o 80-99% cumplimiento)
  ROJO = 'ROJO'          // Crítico (documentos vencidos o < 80% cumplimiento)
}

/**
 * DTO para calcular estado de cumplimiento
 */
export interface CalcularCumplimientoDto {
  entidadId: string;
  entidadTipo: TipoEntidad;
}

/**
 * Filtros para búsqueda de documentos
 */
export interface DocumentoFilters {
  tenantId?: string;
  entidadId?: string;
  entidadTipo?: TipoEntidad;
  docReqId?: string;
  estado?: EstadoDocumento;
  estadoValidacion?: EstadoValidacion;
  vencimientoDesde?: Date;
  vencimientoHasta?: Date;
  searchTerm?: string;                // Busca en nombre archivo, entidad, tipo documento
}
