export interface DashboardContratistaStats {
  totalPersonal: number;
  totalActivos: number;
  materialesPeligrosos: number;
  contratosVigentes: number;

  // Contratos nuevos que requieren acción
  contratosNuevos: Array<{
    numero_contrato: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    monto_estimado: number;
    nivel_riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
    fecha_creacion: string;
    requiere_personal: boolean;
    requiere_activos: boolean;
    requiere_materiales_peligrosos: boolean;
    documentos_requeridos: string[];
  }>;

  // Detalle de contratos del contratista
  contratos: Array<{
    numero_contrato: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: 'VIGENTE' | 'VENCIDO' | 'SUSPENDIDO';
    estado_acreditacion: 'APTO' | 'OBSERVADO' | 'PENDIENTE';
    personal_asignado: number;
    activos_asignados: number;
    materiales_peligrosos: number;
    progreso_documentos: number; // Porcentaje de documentos completados
  }>;
}

export const DASHBOARD_CONTRATISTA_MOCK: DashboardContratistaStats = {
  totalPersonal: 156,
  totalActivos: 45,
  materialesPeligrosos: 23,
  contratosVigentes: 5,

  contratosNuevos: [
    {
      numero_contrato: 'OC 4500032145',
      descripcion: 'Servicio de mantenimiento preventivo de equipos - Zona Sur',
      fecha_inicio: '01/01/2025',
      fecha_fin: '31/12/2025',
      monto_estimado: 180000,
      nivel_riesgo: 'MEDIO',
      fecha_creacion: '15/12/2024',
      requiere_personal: true,
      requiere_activos: true,
      requiere_materiales_peligrosos: false,
      documentos_requeridos: [
        'Plan de Seguridad y Salud',
        'IPERC del Proyecto',
        'Póliza de Seguro SCTR',
        'Certificado de Cumplimiento Legal'
      ]
    },
    {
      numero_contrato: 'OS 4500032201',
      descripcion: 'Perforación y voladura - Ampliación Zona Norte',
      fecha_inicio: '05/01/2025',
      fecha_fin: '30/06/2025',
      monto_estimado: 350000,
      nivel_riesgo: 'ALTO',
      fecha_creacion: '18/12/2024',
      requiere_personal: true,
      requiere_activos: true,
      requiere_materiales_peligrosos: true,
      documentos_requeridos: [
        'Plan de Seguridad y Salud',
        'IPERC del Proyecto',
        'Póliza de Seguro SCTR',
        'Certificado de Manejo de Explosivos',
        'Plan de Gestión de Materiales Peligrosos'
      ]
    }
  ],

  contratos: [
    {
      numero_contrato: 'OC 4500029388',
      descripcion: 'Perforación y voladura - Zona Norte',
      fecha_inicio: '01/11/2024',
      fecha_fin: '31/03/2025',
      estado: 'VIGENTE',
      estado_acreditacion: 'APTO',
      personal_asignado: 35,
      activos_asignados: 12,
      materiales_peligrosos: 8,
      progreso_documentos: 100
    },
    {
      numero_contrato: 'OC 4500028945',
      descripcion: 'Mantenimiento de maquinaria pesada',
      fecha_inicio: '15/10/2024',
      fecha_fin: '15/02/2025',
      estado: 'VIGENTE',
      estado_acreditacion: 'OBSERVADO',
      personal_asignado: 28,
      activos_asignados: 10,
      materiales_peligrosos: 5,
      progreso_documentos: 75
    },
    {
      numero_contrato: 'OS 4500031256',
      descripcion: 'Servicios de topografía',
      fecha_inicio: '01/12/2024',
      fecha_fin: '30/04/2025',
      estado: 'VIGENTE',
      estado_acreditacion: 'PENDIENTE',
      personal_asignado: 15,
      activos_asignados: 8,
      materiales_peligrosos: 0,
      progreso_documentos: 45
    },
    {
      numero_contrato: 'OC 4500027823',
      descripcion: 'Transporte de mineral',
      fecha_inicio: '20/11/2024',
      fecha_fin: '20/05/2025',
      estado: 'VIGENTE',
      estado_acreditacion: 'APTO',
      personal_asignado: 45,
      activos_asignados: 10,
      materiales_peligrosos: 10,
      progreso_documentos: 90
    },
    {
      numero_contrato: 'OC 4500019874',
      descripcion: 'Instalación de sistemas de ventilación',
      fecha_inicio: '01/08/2023',
      fecha_fin: '31/01/2025',
      estado: 'VIGENTE',
      estado_acreditacion: 'OBSERVADO',
      personal_asignado: 33,
      activos_asignados: 5,
      materiales_peligrosos: 0,
      progreso_documentos: 85
    }
  ]
};
