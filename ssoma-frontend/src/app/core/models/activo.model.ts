/**
 * Modelos de Activo - Tipos estrictos
 */

import {
  TipoActivo,
  EstadoOperativoActivo,
  EstadoGeneral
} from '../enums';

// ============================================================================
// ACTIVO
// ============================================================================

/**
 * Activo - Entidad principal
 * Representa vehículos, maquinaria, herramientas, equipos
 */
export interface Activo {
  // Identificadores - REQUERIDOS
  activoId: string;                  // UUID
  tenantId: string;                  // UUID
  empresaId: string;                 // UUID - FK a Empresa dueña

  // Clasificación - REQUERIDOS
  tipoActivo: TipoActivo;            // Enum: VEHICULO, MAQUINARIA, HERRAMIENTA, EQUIPO
  codigo: string;                    // Código único interno

  // Identificación del Activo - Algunos pueden ser null
  marca: string | null;
  modelo: string | null;
  placa: string | null;              // Solo para vehículos
  serie: string | null;              // Número de serie del fabricante

  // Estado Técnico
  anioFabricacion: number | null;    // Año de fabricación
  kilometrajeActual: number | null;  // Solo para vehículos
  horasUso: number | null;           // Para maquinaria
  fechaUltimaCalibracion: Date | null;  // Para equipos que requieren calibración

  // Estado Operativo - REQUERIDO
  estadoOperativo: EstadoOperativoActivo;  // Enum: OPERATIVO, MANTENIMIENTO, FUERA_SERVICIO, DADO_BAJA

  // Flags de Seguridad - REQUERIDOS (siempre booleanos)
  tieneRops: boolean;                // Roll-Over Protective Structure
  tieneFops: boolean;                // Falling Objects Protective Structure
  tieneGuardasSeguridad: boolean;    // Guardas de seguridad instaladas
  tieneCinturonSeguridad: boolean;   // Para vehículos
  tieneExtintor: boolean;            // Extintor a bordo

  // Certificaciones y Cumplimiento
  requiereCertificacion: boolean;    // Si requiere certificación periódica
  fechaProximaCertificacion: Date | null;

  // Ubicación - Puede ser null si no está asignado
  sedeActualId: string | null;       // Sede donde se encuentra actualmente
  ubicacionDetalle: string | null;   // Ubicación específica (almacén, taller, etc)

  // Auditoría - REQUERIDOS
  createdAt: Date;
  updatedAt: Date;

  // Metadata extendida - Tipo específico, no any
  metadata: ActivoMetadata | null;
}

/**
 * Metadata extendida del activo
 * Información adicional específica por tipo
 */
export interface ActivoMetadata {
  capacidadCarga?: number;           // En kg
  potenciaMotor?: number;            // En HP
  tipoCombustible?: string;          // Diesel, Gasolina, Eléctrico
  capacidadTanque?: number;          // En litros
  dimensiones?: {
    largo: number;
    ancho: number;
    alto: number;
  };
  pesoOperativo?: number;            // En kg
  observaciones?: string;
}

/**
 * DTO para crear Activo
 */
export interface CreateActivoDto {
  tenantId: string;
  empresaId: string;
  tipoActivo: TipoActivo;
  codigo: string;
  marca: string | null;
  modelo: string | null;
  placa: string | null;
  serie: string | null;
  anioFabricacion: number | null;
  tieneRops: boolean;
  tieneFops: boolean;
  tieneGuardasSeguridad: boolean;
  tieneCinturonSeguridad: boolean;
  tieneExtintor: boolean;
  requiereCertificacion: boolean;
  metadata: ActivoMetadata | null;
}

/**
 * DTO para actualizar Activo
 */
export interface UpdateActivoDto {
  codigo?: string;
  marca?: string | null;
  modelo?: string | null;
  placa?: string | null;
  serie?: string | null;
  anioFabricacion?: number | null;
  kilometrajeActual?: number | null;
  horasUso?: number | null;
  fechaUltimaCalibracion?: Date | null;
  estadoOperativo?: EstadoOperativoActivo;
  tieneRops?: boolean;
  tieneFops?: boolean;
  tieneGuardasSeguridad?: boolean;
  tieneCinturonSeguridad?: boolean;
  tieneExtintor?: boolean;
  sedeActualId?: string | null;
  ubicacionDetalle?: string | null;
  metadata?: ActivoMetadata | null;
}

/**
 * Activo para listados - Con datos agregados
 */
export interface ActivoListItem {
  activoId: string;
  codigo: string;
  tipoActivo: TipoActivo;
  marca: string | null;
  modelo: string | null;
  placa: string | null;
  estadoOperativo: EstadoOperativoActivo;
  empresaNombre: string;             // Desnormalizado
  ubicacionDetalle: string | null;
  cantidadDocumentosVigentes: number;  // Agregado
  cantidadDocumentosVencidos: number;  // Agregado
  tieneMantenimientoPendiente: boolean;  // Calculado
}

// ============================================================================
// ASIGNACIÓN DE ACTIVO
// ============================================================================

/**
 * Asignación de Activo a Persona
 * Registro de quién tiene asignado el activo
 */
export interface AsignacionActivo {
  // Identificadores - REQUERIDOS
  asignacionId: string;              // UUID
  activoId: string;                  // UUID - FK a Activo
  personaId: string;                 // UUID - FK a Persona

  // Fechas - REQUERIDAS
  fechaAsignacion: Date;
  fechaDevolucionPrevista: Date | null;  // Fecha prevista de devolución
  fechaDevolucionReal: Date | null;      // Fecha real de devolución

  // Estado - REQUERIDO
  estado: EstadoGeneral;             // Enum: ACTIVO, INACTIVO

  // Responsable de la asignación
  asignadoPorId: string;             // ID del usuario que hizo la asignación
  asignadoPorNombre: string;         // Desnormalizado

  // Observaciones
  observacionesAsignacion: string | null;
  observacionesDevolucion: string | null;

  // Auditoría - REQUERIDOS
  createdAt: Date;
  updatedAt: Date;

  // Datos desnormalizados para performance
  activoCodigo: string | null;
  personaNombreCompleto: string | null;
}

/**
 * DTO para crear Asignación
 */
export interface CreateAsignacionActivoDto {
  activoId: string;
  personaId: string;
  fechaAsignacion: Date;
  fechaDevolucionPrevista: Date | null;
  asignadoPorId: string;
  observacionesAsignacion: string | null;
}

/**
 * DTO para registrar devolución
 */
export interface DevolucionActivoDto {
  fechaDevolucionReal: Date;
  observacionesDevolucion: string | null;
}

/**
 * Filtros para búsqueda de activos
 */
export interface ActivoFilters {
  tenantId?: string;
  empresaId?: string;
  tipoActivo?: TipoActivo;
  estadoOperativo?: EstadoOperativoActivo;
  sedeActualId?: string;
  tieneDocumentosVencidos?: boolean;
  searchTerm?: string;               // Busca en código, placa, marca, modelo
}
