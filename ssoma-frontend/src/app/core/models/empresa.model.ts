/**
 * Modelos de Empresa - Redefinidos con tipos estrictos
 * Siguiendo estándares profesionales de TypeScript
 */

import {
  EstadoGeneral,
  TipoContratistaEnum,
  TipoContacto
} from '../enums';

// ============================================================================
// TIPO CONTRATISTA
// ============================================================================

/**
 * Tipo de Contratista (catálogo)
 * Todos los campos son requeridos - esto es un catálogo maestro
 */
export interface TipoContratista {
  tipoId: string;                    // UUID - REQUERIDO
  tenantId: string;                  // UUID - REQUERIDO (para multi-tenancy)
  codigo: TipoContratistaEnum;       // Enum estricto - REQUERIDO
  nombre: string;                    // REQUERIDO
  descripcion: string;               // REQUERIDO (puede ser vacío '' pero no undefined)
  activo: boolean;                   // REQUERIDO
  createdAt: Date;                   // REQUERIDO
  updatedAt: Date;                   // REQUERIDO
}

/**
 * DTO para crear Tipo Contratista
 * No incluye campos auto-generados
 */
export interface CreateTipoContratistaDto {
  tenantId: string;
  codigo: TipoContratistaEnum;
  nombre: string;
  descripcion: string;
}

// ============================================================================
// CONTACTO DE EMPRESA
// ============================================================================

/**
 * Contacto de Empresa
 * Solo email/telefono pueden ser opcionales (uno de los dos debe existir)
 */
export interface EmpresaContacto {
  contactoId: string;                // UUID - REQUERIDO
  empresaId: string;                 // UUID - REQUERIDO
  tenantId: string;                  // UUID - REQUERIDO
  nombreCompleto: string;            // REQUERIDO
  cargo: string;                     // REQUERIDO
  tipoContacto: TipoContacto;        // Enum - REQUERIDO
  email: string | null;              // Explícito: puede ser null
  telefono: string | null;           // Explícito: puede ser null
  esPrincipal: boolean;              // REQUERIDO
  activo: boolean;                   // REQUERIDO
  createdAt: Date;                   // REQUERIDO
}

/**
 * DTO para crear Contacto de Empresa
 * No incluye campos auto-generados
 */
export interface CreateEmpresaContactoDto {
  empresaId: string;
  tenantId: string;
  nombreCompleto: string;
  cargo: string;
  tipoContacto: TipoContacto;
  email: string | null;
  telefono: string | null;
  esPrincipal: boolean;
}

// ============================================================================
// SEDE
// ============================================================================

/**
 * Sede de Empresa
 * Dirección es requerida, latitud/longitud son opcionales
 */
export interface Sede {
  sedeId: string;                    // UUID - REQUERIDO
  empresaId: string;                 // UUID - REQUERIDO
  tenantId: string;                  // UUID - REQUERIDO
  nombre: string;                    // REQUERIDO
  direccion: string;                 // REQUERIDO
  latitud: number | null;            // Opcional - puede ser null si no se georreferencia
  longitud: number | null;           // Opcional - puede ser null si no se georreferencia
  esPrincipal: boolean;              // REQUERIDO
  activo: boolean;                   // REQUERIDO
  createdAt: Date;                   // REQUERIDO
  updatedAt: Date;                   // REQUERIDO
}

/**
 * DTO para crear Sede
 */
export interface CreateSedeDto {
  empresaId: string;
  tenantId: string;
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  esPrincipal: boolean;
}

// ============================================================================
// EMPRESA
// ============================================================================

/**
 * Empresa - Entidad principal
 *
 * Reglas:
 * - Todos los campos de identificación son REQUERIDOS
 * - logoUrl, sitioWeb, rubroComercial pueden ser null (no todas las empresas tienen)
 * - contactos y sedes son arrays vacíos por defecto (NUNCA undefined)
 * - scoreSeguridad es 0 por defecto (NUNCA undefined)
 */
export interface Empresa {
  // Identificadores - TODOS REQUERIDOS
  empresaId: string;                 // UUID
  tenantId: string;                  // UUID

  // Datos Principales - TODOS REQUERIDOS
  ruc: string;                       // 11 dígitos - único
  razonSocial: string;

  // Relación con Tipo - REQUERIDO
  tipoId: string;                    // FK - REQUERIDO (toda empresa tiene tipo)
  tipo: TipoContratista | null;      // Objeto completo si se hace JOIN, null si no

  // Datos de Contacto - REQUERIDOS
  direccion: string;
  telefono: string;
  email: string;

  // Datos Opcionales - Explícitamente null cuando no existen
  logoUrl: string | null;            // URL del logo - puede no tener
  sitioWeb: string | null;           // URL sitio web - puede no tener
  rubroComercial: string | null;     // Sector/rubro - puede no tener

  // Métricas y Estado - REQUERIDOS con valores por defecto
  scoreSeguridad: number;            // 0-100, default: 0
  activo: boolean;                   // REQUERIDO

  // Auditoría - REQUERIDOS
  createdAt: Date;
  updatedAt: Date;

  // Relaciones - NUNCA undefined, arrays vacíos por defecto
  contactos: EmpresaContacto[];      // Default: []
  sedes: Sede[];                     // Default: []
}

/**
 * DTO para crear Empresa
 * No incluye campos auto-generados ni relaciones
 */
export interface CreateEmpresaDto {
  tenantId: string;
  ruc: string;
  razonSocial: string;
  tipoId: string;
  direccion: string;
  telefono: string;
  email: string;
  logoUrl: string | null;
  sitioWeb: string | null;
  rubroComercial: string | null;
}

/**
 * DTO para actualizar Empresa
 * Todos los campos son opcionales excepto el ID
 */
export interface UpdateEmpresaDto {
  razonSocial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logoUrl?: string | null;
  sitioWeb?: string | null;
  rubroComercial?: string | null;
  activo?: boolean;
}

/**
 * Empresa con datos agregados para listados
 * Incluye información desnormalizada para performance
 */
export interface EmpresaListItem {
  empresaId: string;
  tenantId: string;
  ruc: string;
  razonSocial: string;
  tipoNombre: string;                // Desnormalizado
  tipoCodigo: TipoContratistaEnum;   // Desnormalizado
  logoUrl: string | null;
  scoreSeguridad: number;
  activo: boolean;
  cantidadContactos: number;         // Agregado
  cantidadSedes: number;             // Agregado
  cantidadTrabajadores: number;      // Agregado
  cantidadContratosActivos: number;  // Agregado
}

/**
 * Filtros para búsqueda de empresas
 * Todos los campos son opcionales
 */
export interface EmpresaFilters {
  tenantId?: string;
  tipoId?: string;
  activo?: boolean;
  searchTerm?: string;               // Busca en razón social o RUC
  scoreMin?: number;
  scoreMax?: number;
}
