export interface DocumentoRequerible {
  id: number;
  nombre: string;
  categoria: 'GENERALES' | 'PERSONAL' | 'CONDUCTOR' | 'VEHICULO' | 'HERRAMIENTAS' | 'OPERATIVOS' | 'OTROS';
}

export interface TipoContratista {
  id: number;
  nombre: string;
  codigo: 'PERMANENTES' | 'EVENTUALES' | 'VISITAS';
  descripcion?: string;
  requisitos: RequisitoAsignado[];
}

export interface RequisitoAsignado {
  categoriaRequisito: string;
  documentoId: number;
  documentoNombre: string;
  obligatorio: boolean;
  aplica: boolean;
}

// Catálogo de documentos requeribles por categoría
export const DOCUMENTOS_REQUERIBLES_MOCK: DocumentoRequerible[] = [
  // GENERALES
  { id: 1, nombre: 'Registro Único de Contribuyentes (RUC)', categoria: 'GENERALES' },
  { id: 2, nombre: 'Licencia de Funcionamiento', categoria: 'GENERALES' },
  { id: 3, nombre: 'SCTR Salud', categoria: 'GENERALES' },
  { id: 4, nombre: 'SCTR Pensión', categoria: 'GENERALES' },
  { id: 5, nombre: 'Póliza de Responsabilidad Civil', categoria: 'GENERALES' },
  { id: 6, nombre: 'Registro Nacional de Proveedores', categoria: 'GENERALES' },

  // PERSONAL
  { id: 7, nombre: 'Planilla electrónica (T-Registro/PLAME)', categoria: 'PERSONAL' },
  { id: 8, nombre: 'DNI del trabajador', categoria: 'PERSONAL' },
  { id: 9, nombre: 'Examen médico ocupacional', categoria: 'PERSONAL' },
  { id: 10, nombre: 'Carnet de vacunación', categoria: 'PERSONAL' },
  { id: 11, nombre: 'Constancia de inducción general', categoria: 'PERSONAL' },
  { id: 12, nombre: 'Constancia de capacitación específica', categoria: 'PERSONAL' },

  // CONDUCTOR
  { id: 13, nombre: 'Licencia de conducir vigente', categoria: 'CONDUCTOR' },
  { id: 14, nombre: 'Récord del conductor', categoria: 'CONDUCTOR' },
  { id: 15, nombre: 'Examen psicosomático', categoria: 'CONDUCTOR' },
  { id: 16, nombre: 'Curso de manejo defensivo', categoria: 'CONDUCTOR' },

  // VEHICULO
  { id: 17, nombre: 'Tarjeta de propiedad vehicular', categoria: 'VEHICULO' },
  { id: 18, nombre: 'SOAT vigente', categoria: 'VEHICULO' },
  { id: 19, nombre: 'Revisión técnica vigente', categoria: 'VEHICULO' },
  { id: 20, nombre: 'Póliza de seguro vehicular', categoria: 'VEHICULO' },

  // HERRAMIENTAS
  { id: 21, nombre: 'Certificado de calibración de equipos', categoria: 'HERRAMIENTAS' },
  { id: 22, nombre: 'Manual de uso de herramientas', categoria: 'HERRAMIENTAS' },
  { id: 23, nombre: 'Certificado de inspección de herramientas', categoria: 'HERRAMIENTAS' },
  { id: 24, nombre: 'Hoja de vida de equipos', categoria: 'HERRAMIENTAS' },

  // OPERATIVOS
  { id: 25, nombre: 'Plan de Seguridad y Salud en el Trabajo', categoria: 'OPERATIVOS' },
  { id: 26, nombre: 'Análisis de Trabajo Seguro (ATS)', categoria: 'OPERATIVOS' },
  { id: 27, nombre: 'Permiso de Trabajo en Altura', categoria: 'OPERATIVOS' },
  { id: 28, nombre: 'Permiso de Trabajo en Caliente', categoria: 'OPERATIVOS' },
  { id: 29, nombre: 'Plan de Emergencia', categoria: 'OPERATIVOS' },

  // OTROS
  { id: 30, nombre: 'Certificado ISO 9001', categoria: 'OTROS' },
  { id: 31, nombre: 'Certificado ISO 14001', categoria: 'OTROS' },
  { id: 32, nombre: 'Certificado ISO 45001', categoria: 'OTROS' },
  { id: 33, nombre: 'Registro de auditorías internas', categoria: 'OTROS' }
];

// Tipos de contratistas con sus requisitos asignados
export const TIPOS_CONTRATISTAS_MOCK: TipoContratista[] = [
  {
    id: 1,
    nombre: 'Contratistas Permanentes',
    codigo: 'PERMANENTES',
    requisitos: [
      // GENERALES
      { categoriaRequisito: 'GENERALES', documentoId: 1, documentoNombre: 'Registro Único de Contribuyentes (RUC)', obligatorio: true, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 2, documentoNombre: 'Licencia de Funcionamiento', obligatorio: true, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 3, documentoNombre: 'SCTR Salud', obligatorio: true, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 4, documentoNombre: 'SCTR Pensión', obligatorio: true, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 5, documentoNombre: 'Póliza de Responsabilidad Civil', obligatorio: true, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 6, documentoNombre: 'Registro Nacional de Proveedores', obligatorio: false, aplica: true },

      // PERSONAL
      { categoriaRequisito: 'PERSONAL', documentoId: 7, documentoNombre: 'Planilla electrónica (T-Registro/PLAME)', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 8, documentoNombre: 'DNI del trabajador', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 9, documentoNombre: 'Examen médico ocupacional', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 10, documentoNombre: 'Carnet de vacunación', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 11, documentoNombre: 'Constancia de inducción general', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 12, documentoNombre: 'Constancia de capacitación específica', obligatorio: true, aplica: true },

      // CONDUCTOR
      { categoriaRequisito: 'CONDUCTOR', documentoId: 13, documentoNombre: 'Licencia de conducir vigente', obligatorio: true, aplica: true },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 14, documentoNombre: 'Récord del conductor', obligatorio: true, aplica: true },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 15, documentoNombre: 'Examen psicosomático', obligatorio: true, aplica: true },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 16, documentoNombre: 'Curso de manejo defensivo', obligatorio: true, aplica: true },

      // VEHICULO
      { categoriaRequisito: 'VEHICULO', documentoId: 17, documentoNombre: 'Tarjeta de propiedad vehicular', obligatorio: true, aplica: true },
      { categoriaRequisito: 'VEHICULO', documentoId: 18, documentoNombre: 'SOAT vigente', obligatorio: true, aplica: true },
      { categoriaRequisito: 'VEHICULO', documentoId: 19, documentoNombre: 'Revisión técnica vigente', obligatorio: true, aplica: true },
      { categoriaRequisito: 'VEHICULO', documentoId: 20, documentoNombre: 'Póliza de seguro vehicular', obligatorio: true, aplica: true },

      // HERRAMIENTAS
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 21, documentoNombre: 'Certificado de calibración de equipos', obligatorio: true, aplica: true },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 22, documentoNombre: 'Manual de uso de herramientas', obligatorio: true, aplica: true },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 23, documentoNombre: 'Certificado de inspección de herramientas', obligatorio: true, aplica: true },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 24, documentoNombre: 'Hoja de vida de equipos', obligatorio: false, aplica: true },

      // OPERATIVOS
      { categoriaRequisito: 'OPERATIVOS', documentoId: 25, documentoNombre: 'Plan de Seguridad y Salud en el Trabajo', obligatorio: true, aplica: true },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 26, documentoNombre: 'Análisis de Trabajo Seguro (ATS)', obligatorio: true, aplica: true },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 27, documentoNombre: 'Permiso de Trabajo en Altura', obligatorio: true, aplica: true },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 28, documentoNombre: 'Permiso de Trabajo en Caliente', obligatorio: true, aplica: true },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 29, documentoNombre: 'Plan de Emergencia', obligatorio: true, aplica: true },

      // OTROS - no aplica para permanentes
      { categoriaRequisito: 'OTROS', documentoId: 30, documentoNombre: 'Certificado ISO 9001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 31, documentoNombre: 'Certificado ISO 14001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 32, documentoNombre: 'Certificado ISO 45001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 33, documentoNombre: 'Registro de auditorías internas', obligatorio: false, aplica: false }
    ]
  },
  {
    id: 2,
    nombre: 'Contratistas Eventuales',
    codigo: 'EVENTUALES',
    requisitos: [
      // GENERALES
      { categoriaRequisito: 'GENERALES', documentoId: 1, documentoNombre: 'Registro Único de Contribuyentes (RUC)', obligatorio: true, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 2, documentoNombre: 'Licencia de Funcionamiento', obligatorio: false, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 3, documentoNombre: 'SCTR Salud', obligatorio: true, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 4, documentoNombre: 'SCTR Pensión', obligatorio: true, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 5, documentoNombre: 'Póliza de Responsabilidad Civil', obligatorio: false, aplica: true },
      { categoriaRequisito: 'GENERALES', documentoId: 6, documentoNombre: 'Registro Nacional de Proveedores', obligatorio: false, aplica: false },

      // PERSONAL
      { categoriaRequisito: 'PERSONAL', documentoId: 7, documentoNombre: 'Planilla electrónica (T-Registro/PLAME)', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 8, documentoNombre: 'DNI del trabajador', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 9, documentoNombre: 'Examen médico ocupacional', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 10, documentoNombre: 'Carnet de vacunación', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 11, documentoNombre: 'Constancia de inducción general', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 12, documentoNombre: 'Constancia de capacitación específica', obligatorio: false, aplica: true },

      // CONDUCTOR - no aplica para eventuales
      { categoriaRequisito: 'CONDUCTOR', documentoId: 13, documentoNombre: 'Licencia de conducir vigente', obligatorio: false, aplica: false },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 14, documentoNombre: 'Récord del conductor', obligatorio: false, aplica: false },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 15, documentoNombre: 'Examen psicosomático', obligatorio: false, aplica: false },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 16, documentoNombre: 'Curso de manejo defensivo', obligatorio: false, aplica: false },

      // VEHICULO - no aplica para eventuales
      { categoriaRequisito: 'VEHICULO', documentoId: 17, documentoNombre: 'Tarjeta de propiedad vehicular', obligatorio: false, aplica: false },
      { categoriaRequisito: 'VEHICULO', documentoId: 18, documentoNombre: 'SOAT vigente', obligatorio: false, aplica: false },
      { categoriaRequisito: 'VEHICULO', documentoId: 19, documentoNombre: 'Revisión técnica vigente', obligatorio: false, aplica: false },
      { categoriaRequisito: 'VEHICULO', documentoId: 20, documentoNombre: 'Póliza de seguro vehicular', obligatorio: false, aplica: false },

      // HERRAMIENTAS - no aplica para eventuales
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 21, documentoNombre: 'Certificado de calibración de equipos', obligatorio: false, aplica: false },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 22, documentoNombre: 'Manual de uso de herramientas', obligatorio: false, aplica: false },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 23, documentoNombre: 'Certificado de inspección de herramientas', obligatorio: false, aplica: false },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 24, documentoNombre: 'Hoja de vida de equipos', obligatorio: false, aplica: false },

      // OPERATIVOS
      { categoriaRequisito: 'OPERATIVOS', documentoId: 25, documentoNombre: 'Plan de Seguridad y Salud en el Trabajo', obligatorio: true, aplica: true },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 26, documentoNombre: 'Análisis de Trabajo Seguro (ATS)', obligatorio: true, aplica: true },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 27, documentoNombre: 'Permiso de Trabajo en Altura', obligatorio: false, aplica: true },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 28, documentoNombre: 'Permiso de Trabajo en Caliente', obligatorio: false, aplica: true },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 29, documentoNombre: 'Plan de Emergencia', obligatorio: true, aplica: true },

      // OTROS - no aplica para eventuales
      { categoriaRequisito: 'OTROS', documentoId: 30, documentoNombre: 'Certificado ISO 9001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 31, documentoNombre: 'Certificado ISO 14001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 32, documentoNombre: 'Certificado ISO 45001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 33, documentoNombre: 'Registro de auditorías internas', obligatorio: false, aplica: false }
    ]
  },
  {
    id: 3,
    nombre: 'Visitas',
    codigo: 'VISITAS',
    requisitos: [
      // GENERALES - no aplica para visitas
      { categoriaRequisito: 'GENERALES', documentoId: 1, documentoNombre: 'Registro Único de Contribuyentes (RUC)', obligatorio: false, aplica: false },
      { categoriaRequisito: 'GENERALES', documentoId: 2, documentoNombre: 'Licencia de Funcionamiento', obligatorio: false, aplica: false },
      { categoriaRequisito: 'GENERALES', documentoId: 3, documentoNombre: 'SCTR Salud', obligatorio: false, aplica: false },
      { categoriaRequisito: 'GENERALES', documentoId: 4, documentoNombre: 'SCTR Pensión', obligatorio: false, aplica: false },
      { categoriaRequisito: 'GENERALES', documentoId: 5, documentoNombre: 'Póliza de Responsabilidad Civil', obligatorio: false, aplica: false },
      { categoriaRequisito: 'GENERALES', documentoId: 6, documentoNombre: 'Registro Nacional de Proveedores', obligatorio: false, aplica: false },

      // PERSONAL
      { categoriaRequisito: 'PERSONAL', documentoId: 7, documentoNombre: 'Planilla electrónica (T-Registro/PLAME)', obligatorio: false, aplica: false },
      { categoriaRequisito: 'PERSONAL', documentoId: 8, documentoNombre: 'DNI del trabajador', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 9, documentoNombre: 'Examen médico ocupacional', obligatorio: false, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 10, documentoNombre: 'Carnet de vacunación', obligatorio: false, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 11, documentoNombre: 'Constancia de inducción general', obligatorio: true, aplica: true },
      { categoriaRequisito: 'PERSONAL', documentoId: 12, documentoNombre: 'Constancia de capacitación específica', obligatorio: false, aplica: false },

      // CONDUCTOR
      { categoriaRequisito: 'CONDUCTOR', documentoId: 13, documentoNombre: 'Licencia de conducir vigente', obligatorio: true, aplica: true },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 14, documentoNombre: 'Récord del conductor', obligatorio: false, aplica: true },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 15, documentoNombre: 'Examen psicosomático', obligatorio: false, aplica: false },
      { categoriaRequisito: 'CONDUCTOR', documentoId: 16, documentoNombre: 'Curso de manejo defensivo', obligatorio: false, aplica: false },

      // VEHICULO
      { categoriaRequisito: 'VEHICULO', documentoId: 17, documentoNombre: 'Tarjeta de propiedad vehicular', obligatorio: true, aplica: true },
      { categoriaRequisito: 'VEHICULO', documentoId: 18, documentoNombre: 'SOAT vigente', obligatorio: true, aplica: true },
      { categoriaRequisito: 'VEHICULO', documentoId: 19, documentoNombre: 'Revisión técnica vigente', obligatorio: false, aplica: true },
      { categoriaRequisito: 'VEHICULO', documentoId: 20, documentoNombre: 'Póliza de seguro vehicular', obligatorio: false, aplica: false },

      // HERRAMIENTAS - no aplica para visitas
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 21, documentoNombre: 'Certificado de calibración de equipos', obligatorio: false, aplica: false },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 22, documentoNombre: 'Manual de uso de herramientas', obligatorio: false, aplica: false },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 23, documentoNombre: 'Certificado de inspección de herramientas', obligatorio: false, aplica: false },
      { categoriaRequisito: 'HERRAMIENTAS', documentoId: 24, documentoNombre: 'Hoja de vida de equipos', obligatorio: false, aplica: false },

      // OPERATIVOS - no aplica para visitas
      { categoriaRequisito: 'OPERATIVOS', documentoId: 25, documentoNombre: 'Plan de Seguridad y Salud en el Trabajo', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 26, documentoNombre: 'Análisis de Trabajo Seguro (ATS)', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 27, documentoNombre: 'Permiso de Trabajo en Altura', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 28, documentoNombre: 'Permiso de Trabajo en Caliente', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OPERATIVOS', documentoId: 29, documentoNombre: 'Plan de Emergencia', obligatorio: false, aplica: false },

      // OTROS - no aplica para visitas
      { categoriaRequisito: 'OTROS', documentoId: 30, documentoNombre: 'Certificado ISO 9001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 31, documentoNombre: 'Certificado ISO 14001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 32, documentoNombre: 'Certificado ISO 45001', obligatorio: false, aplica: false },
      { categoriaRequisito: 'OTROS', documentoId: 33, documentoNombre: 'Registro de auditorías internas', obligatorio: false, aplica: false }
    ]
  }
];
