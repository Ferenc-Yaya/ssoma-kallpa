export interface Contrato {
  contrato_id: number;
  tenant_id: string;
  empresa_id: number;
  empresa_nombre: string;
  numero_contrato: string;
  numero_oc: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  nivel_riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
  admin_contrato_kallpa: string;
  monto_total: number;
  estado: 'VIGENTE' | 'VENCIDO' | 'SUSPENDIDO';
  estado_acreditacion: 'APTO' | 'OBSERVADO' | 'PENDIENTE';
  qr_code: string;
  trabajadores_ids: number[];
  documentos_aprobados: DocumentoAprobado[];
  created_at: string;
}

export interface DocumentoAprobado {
  tipo: string;
  fechaAprobacion: string;
  vigencia: string;
}

export const CONTRATOS_MOCK: Contrato[] = [
  {
    contrato_id: 1,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    empresa_nombre: 'Contratista KALLPA SAC',
    numero_contrato: 'OC 4500029388',
    numero_oc: 'OC 4500029388',
    descripcion: 'Servicio de Mantenimiento de Equipos - Planta Norte',
    fecha_inicio: '2024-01-15',
    fecha_fin: '2024-12-31',
    nivel_riesgo: 'MEDIO',
    admin_contrato_kallpa: 'Ing. Carlos Mendoza',
    monto_total: 150000.00,
    estado: 'VIGENTE',
    estado_acreditacion: 'APTO',
    qr_code: 'QR-OC-4500029388',
    trabajadores_ids: [1, 2, 3, 4],
    documentos_aprobados: [
      {
        tipo: 'Contrato de Servicios',
        fechaAprobacion: '15/01/2024',
        vigencia: '31/12/2024'
      },
      {
        tipo: 'Póliza de Seguro SCTR',
        fechaAprobacion: '15/01/2024',
        vigencia: '31/12/2024'
      },
      {
        tipo: 'Certificado de Cumplimiento Legal',
        fechaAprobacion: '15/01/2024',
        vigencia: '31/12/2024'
      },
      {
        tipo: 'Plan de Seguridad y Salud',
        fechaAprobacion: '20/01/2024',
        vigencia: '31/12/2024'
      },
      {
        tipo: 'IPERC del Proyecto',
        fechaAprobacion: '20/01/2024',
        vigencia: '31/12/2024'
      }
    ],
    created_at: '2024-01-15T10:00:00'
  },
  {
    contrato_id: 2,
    tenant_id: 'KALLPA',
    empresa_id: 2,
    empresa_nombre: 'Servicios Mineros del Sur',
    numero_contrato: 'OS 4500029400',
    numero_oc: 'OS 4500029400',
    descripcion: 'Perforación y Voladura - Zona 3',
    fecha_inicio: '2024-03-20',
    fecha_fin: '2024-09-30',
    nivel_riesgo: 'ALTO',
    admin_contrato_kallpa: 'Ing. María Torres',
    monto_total: 280000.00,
    estado: 'VIGENTE',
    estado_acreditacion: 'OBSERVADO',
    qr_code: 'QR-OS-4500029400',
    trabajadores_ids: [5, 6],
    documentos_aprobados: [
      {
        tipo: 'Contrato de Servicios',
        fechaAprobacion: '20/03/2024',
        vigencia: '30/09/2024'
      },
      {
        tipo: 'Póliza de Seguro SCTR',
        fechaAprobacion: '20/03/2024',
        vigencia: '30/09/2024'
      },
      {
        tipo: 'Certificado de Manejo de Explosivos',
        fechaAprobacion: '25/03/2024',
        vigencia: '30/09/2024'
      }
    ],
    created_at: '2024-03-20T14:15:00'
  },
  {
    contrato_id: 3,
    tenant_id: 'KALLPA',
    empresa_id: 3,
    empresa_nombre: 'Construcciones Industriales SAA',
    numero_contrato: 'OC 4500031257',
    numero_oc: 'OC 4500031257',
    descripcion: 'Construcción de Galpón Industrial',
    fecha_inicio: '2024-02-10',
    fecha_fin: '2024-08-31',
    nivel_riesgo: 'MEDIO',
    admin_contrato_kallpa: 'Ing. Roberto Silva',
    monto_total: 450000.00,
    estado: 'VIGENTE',
    estado_acreditacion: 'PENDIENTE',
    qr_code: 'QR-OC-4500031257',
    trabajadores_ids: [7, 8],
    documentos_aprobados: [
      {
        tipo: 'Contrato de Servicios',
        fechaAprobacion: '10/02/2024',
        vigencia: '31/08/2024'
      }
    ],
    created_at: '2024-02-10T09:00:00'
  },
  {
    contrato_id: 4,
    tenant_id: 'KALLPA',
    empresa_id: 4,
    empresa_nombre: 'Consultores Externos EIRL',
    numero_contrato: 'OS 4500028945',
    numero_oc: 'OS 4500028945',
    descripcion: 'Auditoría SSOMA Anual',
    fecha_inicio: '2024-05-05',
    fecha_fin: '2024-06-30',
    nivel_riesgo: 'BAJO',
    admin_contrato_kallpa: 'Lic. Ana Martínez',
    monto_total: 35000.00,
    estado: 'VIGENTE',
    estado_acreditacion: 'APTO',
    qr_code: 'QR-OS-4500028945',
    trabajadores_ids: [9, 10],
    documentos_aprobados: [
      {
        tipo: 'Contrato de Servicios',
        fechaAprobacion: '05/05/2024',
        vigencia: '30/06/2024'
      },
      {
        tipo: 'Certificado de Competencia Profesional',
        fechaAprobacion: '05/05/2024',
        vigencia: '30/06/2024'
      }
    ],
    created_at: '2024-05-05T11:20:00'
  }
];