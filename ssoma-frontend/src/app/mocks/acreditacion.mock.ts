export interface DocumentoAcreditacion {
  documento_id: number;
  documento_requerible_id: number;
  nombre: string;
  archivo_url?: string;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  estado_revision: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE';
  motivo_rechazo?: string;
  fecha_revision?: string;
  revisor_nombre?: string;
  obligatorio: boolean;
}

export interface PersonaAcreditacion {
  persona_id: number;
  nombre_completo: string;
  dni: string;
  cargo: string;
  foto_url: string;
  documentos: DocumentoAcreditacion[];
}

export interface ActivoAcreditacion {
  activo_id: number;
  tipo: 'VEHICULO' | 'HERRAMIENTA';
  descripcion: string;
  codigo: string;
  marca?: string;
  modelo?: string;
  documentos: DocumentoAcreditacion[];
}

export interface MaterialAcreditacion {
  material_id: number;
  nombre_sustancia: string;
  codigo_un: string;
  cantidad: number;
  unidad_medida: string;
  documentos: DocumentoAcreditacion[];
}

export interface ContratoAcreditacion {
  contrato_id: number;
  numero_contrato: string;
  empresa_id: number;
  empresa_nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  nivel_riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
  admin_contrato: string;
  estado_acreditacion: 'APTO' | 'OBSERVADO' | 'PENDIENTE';
  
  // Documentos propios del contrato (DSH, EHS, ADM CONTRATO)
  documentos_contrato: DocumentoAcreditacion[];

  personas: PersonaAcreditacion[];
  activos: ActivoAcreditacion[];
  materiales: MaterialAcreditacion[];
  
  progreso: {
    docs_aprobados: number;
    docs_rechazados: number;
    docs_pendientes: number;
    docs_totales: number;
    porcentaje: number;
  };
}

export const CONTRATOS_ACREDITACION_MOCK: ContratoAcreditacion[] = [
  {
    contrato_id: 1,
    numero_contrato: 'CONT-2024-001',
    empresa_id: 1,
    empresa_nombre: 'Contratista KALLPA SAC',
    descripcion: 'Servicio de Mantenimiento de Equipos - Planta Norte',
    fecha_inicio: '2024-01-15',
    fecha_fin: '2024-12-31',
    nivel_riesgo: 'MEDIO',
    admin_contrato: 'Ing. Carlos Mendoza',
    estado_acreditacion: 'PENDIENTE',

    // Documentos propios del contrato
    documentos_contrato: [
      {
        documento_id: 100,
        documento_requerible_id: 100,
        nombre: 'Anexo 4 - DI Cumplimiento de requerimientos EHS',
        estado_revision: 'APROBADO',
        fecha_revision: '2024-01-18',
        revisor_nombre: 'Admin SSOMA',
        obligatorio: true
      },
      {
        documento_id: 101,
        documento_requerible_id: 101,
        nombre: 'F1 - F.ADM.EHS.001 - Términos de referencia EHS del Servicio',
        estado_revision: 'PENDIENTE',
        obligatorio: true
      },
      {
        documento_id: 102,
        documento_requerible_id: 102,
        nombre: 'F2 - F.ADM.EHS.002 - Control de Personal Contratista y Subcontratista',
        estado_revision: 'PENDIENTE',
        obligatorio: true
      },
      {
        documento_id: 103,
        documento_requerible_id: 103,
        nombre: 'F3 - F.ADM.EHS.003 - Control de Vehículos equipos y Herramientas',
        estado_revision: 'APROBADO',
        fecha_revision: '2024-01-19',
        revisor_nombre: 'Admin SSOMA',
        obligatorio: true
      },
      {
        documento_id: 104,
        documento_requerible_id: 104,
        nombre: 'F4 - F.ADM.EHS.004 - Control de ingreso Sustancias Peligrosas',
        estado_revision: 'PENDIENTE',
        obligatorio: true
      }
    ],
    
    personas: [
      {
        persona_id: 1,
        nombre_completo: 'Juan Carlos Pérez García',
        dni: '43218765',
        cargo: 'Operador de Maquinaria',
        foto_url: 'https://i.pravatar.cc/150?img=12',
        documentos: [
          {
            documento_id: 1,
            documento_requerible_id: 1,
            nombre: 'SCTR Salud',
            archivo_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fecha_emision: '2024-01-15',
            fecha_vencimiento: '2024-12-31',
            estado_revision: 'APROBADO',
            fecha_revision: '2024-01-20',
            revisor_nombre: 'Admin SSOMA',
            obligatorio: true
          },
          {
            documento_id: 2,
            documento_requerible_id: 2,
            nombre: 'SCTR Pensión',
            archivo_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fecha_emision: '2024-01-15',
            fecha_vencimiento: '2024-12-31',
            estado_revision: 'APROBADO',
            fecha_revision: '2024-01-20',
            revisor_nombre: 'Admin SSOMA',
            obligatorio: true
          },
          {
            documento_id: 3,
            documento_requerible_id: 3,
            nombre: 'Examen Médico Ocupacional',
            archivo_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fecha_emision: '2024-01-10',
            fecha_vencimiento: '2025-01-10',
            estado_revision: 'PENDIENTE',
            obligatorio: true
          },
          {
            documento_id: 4,
            documento_requerible_id: 4,
            nombre: 'Carnet de Vacunación',
            archivo_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fecha_emision: '2024-01-05',
            fecha_vencimiento: '2025-01-05',
            estado_revision: 'RECHAZADO',
            motivo_rechazo: 'Falta vacuna contra Hepatitis B',
            fecha_revision: '2024-01-22',
            revisor_nombre: 'Admin SSOMA',
            obligatorio: true
          },
          {
            documento_id: 5,
            documento_requerible_id: 5,
            nombre: 'Inducción SSOMA',
            estado_revision: 'PENDIENTE',
            obligatorio: true
          }
        ]
      },
      {
        persona_id: 2,
        nombre_completo: 'María Claudia López Silva',
        dni: '45678912',
        cargo: 'Supervisor de Seguridad',
        foto_url: 'https://i.pravatar.cc/150?img=5',
        documentos: [
          {
            documento_id: 7,
            documento_requerible_id: 1,
            nombre: 'SCTR Salud',
            archivo_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fecha_emision: '2024-01-15',
            fecha_vencimiento: '2024-12-31',
            estado_revision: 'PENDIENTE',
            obligatorio: true
          },
          {
            documento_id: 8,
            documento_requerible_id: 2,
            nombre: 'SCTR Pensión',
            estado_revision: 'PENDIENTE',
            obligatorio: true
          }
        ]
      }
    ],
    
    activos: [
      {
        activo_id: 1,
        tipo: 'VEHICULO',
        descripcion: 'Camioneta Pick-Up',
        codigo: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Hilux 2022',
        documentos: [
          {
            documento_id: 20,
            documento_requerible_id: 10,
            nombre: 'SOAT',
            archivo_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fecha_emision: '2024-01-01',
            fecha_vencimiento: '2025-01-01',
            estado_revision: 'APROBADO',
            obligatorio: true
          },
          {
            documento_id: 21,
            documento_requerible_id: 11,
            nombre: 'Revisión Técnica',
            estado_revision: 'PENDIENTE',
            obligatorio: true
          }
        ]
      }
    ],
    
    materiales: [],
    
    progreso: {
      docs_aprobados: 3,
      docs_rechazados: 1,
      docs_pendientes: 5,
      docs_totales: 9,
      porcentaje: 33
    }
  }
];