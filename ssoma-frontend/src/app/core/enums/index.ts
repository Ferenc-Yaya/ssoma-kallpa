/**
 * Enums centralizados para toda la aplicación
 * Esto elimina el uso de strings mágicos y mejora el type safety
 */

// ============================================================================
// ESTADOS GENERALES
// ============================================================================

export enum EstadoGeneral {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
}

export enum EstadoHabilitacion {
  HABILITADO = 'HABILITADO',
  INHABILITADO = 'INHABILITADO',
  SUSPENDIDO = 'SUSPENDIDO'
}

// ============================================================================
// EMPRESA
// ============================================================================

export enum TipoContratistaEnum {
  HOST = 'HOST',                    // Empresa Principal
  PERMANENTE = 'PERMANENTE',        // Contratista Permanente
  EVENTUAL = 'EVENTUAL',            // Contratista Eventual
  VISITAS = 'VISITAS'               // Visitas
}

// ============================================================================
// CONTRATO
// ============================================================================

export enum EstadoContrato {
  VIGENTE = 'VIGENTE',
  VENCIDO = 'VENCIDO',
  SUSPENDIDO = 'SUSPENDIDO',
  CANCELADO = 'CANCELADO'
}

export enum NivelRiesgo {
  BAJO = 'BAJO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
  MUY_ALTO = 'MUY_ALTO'
}

export enum EstadoAcreditacion {
  PENDIENTE = 'PENDIENTE',
  APTO = 'APTO',
  OBSERVADO = 'OBSERVADO',
  BLOQUEADO = 'BLOQUEADO',
  NO_APLICA = 'NO_APLICA'
}

// ============================================================================
// DOCUMENTOS
// ============================================================================

export enum EstadoDocumento {
  VIGENTE = 'VIGENTE',
  VENCIDO = 'VENCIDO',
  POR_VENCER = 'POR_VENCER',
  NO_PRESENTADO = 'NO_PRESENTADO'
}

export enum EstadoValidacion {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  OBSERVADO = 'OBSERVADO'
}

export enum TipoEntidad {
  EMPRESA = 'EMPRESA',
  PERSONA = 'PERSONA',
  ACTIVO = 'ACTIVO',
  MATERIAL = 'MATERIAL',
  CONTRATO = 'CONTRATO'
}

export enum PeriodicidadDocumento {
  UNICO = 'UNICO',                  // Una sola vez
  ANUAL = 'ANUAL',                  // Cada año
  SEMESTRAL = 'SEMESTRAL',          // Cada 6 meses
  TRIMESTRAL = 'TRIMESTRAL',        // Cada 3 meses
  MENSUAL = 'MENSUAL',              // Cada mes
  POR_TRABAJO = 'POR_TRABAJO'       // Por cada trabajo
}

// ============================================================================
// PERSONA / TRABAJADOR
// ============================================================================

export enum TipoDocumentoIdentidad {
  DNI = 'DNI',
  CE = 'CE',                        // Carnet de Extranjería
  PASAPORTE = 'PASAPORTE'
}

export enum EstadoPersona {
  ACTIVO = 'ACTIVO',
  CESADO = 'CESADO',
  SUSPENDIDO = 'SUSPENDIDO',
  LICENCIA = 'LICENCIA'
}

export enum GrupoSanguineo {
  A_POSITIVO = 'A+',
  A_NEGATIVO = 'A-',
  B_POSITIVO = 'B+',
  B_NEGATIVO = 'B-',
  AB_POSITIVO = 'AB+',
  AB_NEGATIVO = 'AB-',
  O_POSITIVO = 'O+',
  O_NEGATIVO = 'O-'
}

// ============================================================================
// ACTIVOS
// ============================================================================

export enum TipoActivo {
  VEHICULO = 'VEHICULO',
  MAQUINARIA = 'MAQUINARIA',
  HERRAMIENTA = 'HERRAMIENTA',
  EQUIPO = 'EQUIPO'
}

export enum EstadoOperativoActivo {
  OPERATIVO = 'OPERATIVO',
  MANTENIMIENTO = 'MANTENIMIENTO',
  FUERA_SERVICIO = 'FUERA_SERVICIO',
  DADO_BAJA = 'DADO_BAJA'
}

// ============================================================================
// ROLES Y PERMISOS
// ============================================================================

export enum TipoRol {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN_KALLPA = 'ADMIN_KALLPA',
  SUPERVISOR_EHS = 'SUPERVISOR_EHS',
  ADMIN_CONTRATISTA = 'ADMIN_CONTRATISTA',
  TRABAJADOR = 'TRABAJADOR',
  VISITANTE = 'VISITANTE'
}

// ============================================================================
// NOTIFICACIONES
// ============================================================================

export enum TipoNotificacion {
  DOCUMENTO_VENCIDO = 'DOCUMENTO_VENCIDO',
  DOCUMENTO_POR_VENCER = 'DOCUMENTO_POR_VENCER',
  ACREDITACION_OBSERVADA = 'ACREDITACION_OBSERVADA',
  CONTRATO_POR_VENCER = 'CONTRATO_POR_VENCER',
  NUEVA_ASIGNACION = 'NUEVA_ASIGNACION',
  SISTEMA = 'SISTEMA'
}

export enum EstadoNotificacion {
  NO_LEIDA = 'NO_LEIDA',
  LEIDA = 'LEIDA',
  ARCHIVADA = 'ARCHIVADA'
}

// ============================================================================
// CONTACTOS
// ============================================================================

export enum TipoContacto {
  COMERCIAL = 'COMERCIAL',
  SEGURIDAD = 'SEGURIDAD',
  OPERACIONES = 'OPERACIONES',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  LEGAL = 'LEGAL'
}
