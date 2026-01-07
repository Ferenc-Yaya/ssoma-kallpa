/**
 * Modelos de Usuario y Persona - Tipos estrictos
 */

import {
  TipoDocumentoIdentidad,
  EstadoPersona,
  GrupoSanguineo,
  TipoRol,
  EstadoGeneral,
  EstadoAcreditacion
} from '../enums';

// ============================================================================
// ROL
// ============================================================================

/**
 * Rol - Define permisos y accesos en el sistema
 */
export interface Rol {
  // Identificadores - REQUERIDOS
  rolId: string;                     // UUID
  tenantId: string;                  // UUID

  // Clasificación - REQUERIDOS
  codigo: TipoRol;                   // Enum: SUPERADMIN, ADMIN_KALLPA, etc
  nombreRol: string;                 // Nombre descriptivo
  descripcion: string;               // Descripción del rol

  // Permisos - REQUERIDO (tipo específico, no any)
  permisos: RolPermisos;             // Objeto tipado de permisos

  // Estado - REQUERIDO
  activo: boolean;

  // Auditoría - REQUERIDOS
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permisos del Rol
 * Define qué puede hacer cada rol en el sistema
 */
export interface RolPermisos {
  // Módulos de Empresas
  empresas: {
    leer: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };

  // Módulos de Contratos
  contratos: {
    leer: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
    aprobar: boolean;
  };

  // Módulos de Personal
  personal: {
    leer: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };

  // Módulos de Documentos
  documentos: {
    leer: boolean;
    cargar: boolean;
    validar: boolean;
    rechazar: boolean;
    eliminar: boolean;
  };

  // Módulos de Activos
  activos: {
    leer: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
    asignar: boolean;
  };

  // Configuración
  configuracion: {
    leerReglas: boolean;
    editarReglas: boolean;
    gestionarUsuarios: boolean;
    gestionarRoles: boolean;
  };

  // Reportes
  reportes: {
    verDashboard: boolean;
    exportarDatos: boolean;
    verAuditoria: boolean;
  };
}

// ============================================================================
// PERSONA
// ============================================================================

/**
 * Persona - Entidad principal de trabajadores/personal
 */
export interface Persona {
  // Identificadores - REQUERIDOS
  personaId: string;                 // UUID
  tenantId: string;                  // UUID
  empresaId: string;                 // UUID - FK a Empresa empleadora

  // Contrato activo - Puede ser null si no tiene contrato vigente
  contratoActivoId: string | null;   // UUID del contrato activo

  // Documento de Identidad - REQUERIDOS
  tipoDocumento: TipoDocumentoIdentidad;  // Enum: DNI, CE, PASAPORTE
  numeroDocumento: string;           // Número del documento

  // Datos Personales - REQUERIDOS
  nombres: string;
  apellidos: string;
  nombreCompleto: string;            // Desnormalizado: nombres + apellidos

  // Datos Personales Adicionales
  fechaNacimiento: Date;             // REQUERIDO
  telefono: string | null;           // Puede no tener
  telefonoEmergencia: string | null; // Contacto de emergencia
  email: string | null;              // Puede no tener

  // Datos Laborales - REQUERIDOS
  cargo: string;
  fechaIngreso: Date;                // Fecha de ingreso a la empresa
  fechaCese: Date | null;            // Fecha de cese (null si está activo)

  // Información Adicional
  esConductor: boolean;              // REQUERIDO
  grupoSanguineo: GrupoSanguineo | null;  // Enum o null si no se conoce
  fotoPerfilUrl: string | null;      // URL de la foto

  // Estado - REQUERIDOS
  estadoGlobal: EstadoPersona;       // Enum: ACTIVO, CESADO, SUSPENDIDO, LICENCIA
  estadoAcreditacion: EstadoAcreditacion;  // Enum: PENDIENTE, APTO, OBSERVADO, BLOQUEADO

  // Auditoría - REQUERIDOS
  createdAt: Date;
  updatedAt: Date;

  // Datos desnormalizados para performance (pueden ser null si no se cargan)
  empresaNombre: string | null;
  contratoNumero: string | null;
}

/**
 * DTO para crear Persona
 */
export interface CreatePersonaDto {
  tenantId: string;
  empresaId: string;
  contratoActivoId: string | null;
  tipoDocumento: TipoDocumentoIdentidad;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  telefono: string | null;
  telefonoEmergencia: string | null;
  email: string | null;
  cargo: string;
  fechaIngreso: Date;
  esConductor: boolean;
  grupoSanguineo: GrupoSanguineo | null;
}

/**
 * DTO para actualizar Persona
 */
export interface UpdatePersonaDto {
  telefono?: string | null;
  telefonoEmergencia?: string | null;
  email?: string | null;
  cargo?: string;
  esConductor?: boolean;
  grupoSanguineo?: GrupoSanguineo | null;
  fotoPerfilUrl?: string | null;
  estadoGlobal?: EstadoPersona;
  fechaCese?: Date | null;
}

/**
 * Persona para listados - Con datos agregados
 */
export interface PersonaListItem {
  personaId: string;
  numeroDocumento: string;
  nombreCompleto: string;
  cargo: string;
  empresaNombre: string;
  contratoNumero: string | null;
  estadoGlobal: EstadoPersona;
  estadoAcreditacion: EstadoAcreditacion;
  fotoPerfilUrl: string | null;
  cantidadDocumentosVigentes: number;    // Agregado
  cantidadDocumentosVencidos: number;    // Agregado
  diasUltimaActualizacion: number;       // Calculado
}

// ============================================================================
// USUARIO
// ============================================================================

/**
 * Usuario - Cuenta de acceso al sistema
 * Puede o no estar vinculado a una Persona
 */
export interface Usuario {
  // Identificadores - REQUERIDOS
  usuarioId: string;                 // UUID
  tenantId: string;                  // UUID

  // Credenciales - REQUERIDAS
  username: string;                  // Nombre de usuario único
  email: string;                     // Email único

  // Datos personales - REQUERIDOS
  nombreCompleto: string;            // Nombre para mostrar

  // Relación con Persona - Puede ser null si es usuario administrativo sin persona
  personaId: string | null;          // UUID de la persona vinculada
  persona: Persona | null;           // Objeto completo si se carga

  // Rol - REQUERIDO
  rolId: string;                     // UUID del rol
  rol: Rol | null;                   // Objeto completo si se carga

  // Estado - REQUERIDO
  activo: boolean;

  // Acceso - REQUERIDOS
  ultimoAcceso: Date | null;         // Última vez que inició sesión
  intentosFallidos: number;          // Contador de intentos fallidos
  bloqueadoHasta: Date | null;       // Si está temporalmente bloqueado

  // Preferencias del Usuario - REQUERIDO
  preferencias: UsuarioPreferencias;

  // Auditoría - REQUERIDOS
  createdAt: Date;
  updatedAt: Date;

  // Datos desnormalizados
  rolNombre: string | null;
  personaNombreCompleto: string | null;
}

/**
 * Preferencias del Usuario
 */
export interface UsuarioPreferencias {
  idioma: string;                    // 'es', 'en'
  tema: string;                      // 'light', 'dark'
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  paginacionDefecto: number;         // Registros por página
}

/**
 * DTO para crear Usuario
 */
export interface CreateUsuarioDto {
  tenantId: string;
  username: string;
  email: string;
  nombreCompleto: string;
  password: string;                  // Se enviará hasheado
  personaId: string | null;
  rolId: string;
}

/**
 * DTO para actualizar Usuario
 */
export interface UpdateUsuarioDto {
  email?: string;
  nombreCompleto?: string;
  rolId?: string;
  activo?: boolean;
  preferencias?: Partial<UsuarioPreferencias>;
}

/**
 * DTO para cambiar contraseña
 */
export interface CambiarPasswordDto {
  passwordActual: string;
  passwordNueva: string;
}

/**
 * Usuario para listados
 */
export interface UsuarioListItem {
  usuarioId: string;
  username: string;
  email: string;
  nombreCompleto: string;
  rolNombre: string;
  activo: boolean;
  ultimoAcceso: Date | null;
  personaNombreCompleto: string | null;
}

/**
 * Filtros para búsqueda de personas
 */
export interface PersonaFilters {
  tenantId?: string;
  empresaId?: string;
  contratoId?: string;
  estadoGlobal?: EstadoPersona;
  estadoAcreditacion?: EstadoAcreditacion;
  esConductor?: boolean;
  searchTerm?: string;               // Busca en nombre, documento, cargo
}

/**
 * Filtros para búsqueda de usuarios
 */
export interface UsuarioFilters {
  tenantId?: string;
  rolId?: string;
  activo?: boolean;
  searchTerm?: string;               // Busca en username, email, nombre
}
