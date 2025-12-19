export interface DashboardStats {
  totalEmpresasProveedoras: number;
  totalEmpleados: number;
  totalActivos: number;
  materialesPeligrosos: number;
  contratosActivos: number;
  documentosVencidos: number;
  semaforo: {
    apto: number;
    pendiente: number;
    bloqueado: number;
  };
  topObservaciones: Array<{
    posicion: number;
    empresa: string;
    documentosVencidos: number;
    documentosFaltantes: number;
    colorSemaforo: 'VERDE' | 'AMARILLO' | 'ROJO';
  }>;
  proveedores: Array<{
    proveedor: string;
    empleados: number;
    activos: string;
    materialesPeligrosos: number;
    contratos: number;
    estado: 'BLOQUEADO' | 'APTO' | 'PENDIENTE';
    acreditacion: number;
    detalleContratos: Array<{
      numeroContrato: string;
      descripcion: string;
      empleados: number;
      activos: number;
      materialesPel: number;
      fechaInicio: string;
      fechaFin: string;
      estadoContrato: 'ACTIVA' | 'PENDIENTE' | 'POR VENCER';
    }>;
  }>;
}

export const DASHBOARD_MOCK: DashboardStats = {
  totalEmpresasProveedoras: 45,
  totalEmpleados: 1250,
  totalActivos: 348,
  materialesPeligrosos: 127,
  contratosActivos: 89,
  documentosVencidos: 23,
  semaforo: {
    apto: 85,
    pendiente: 10,
    bloqueado: 5
  },
  topObservaciones: [
    { posicion: 1, empresa: 'Servicios Mineros del Sur', documentosVencidos: 8, documentosFaltantes: 4, colorSemaforo: 'ROJO' },
    { posicion: 2, empresa: 'Construcciones Industriales SAA', documentosVencidos: 5, documentosFaltantes: 3, colorSemaforo: 'ROJO' },
    { posicion: 3, empresa: 'Transportes Andinos EIRL', documentosVencidos: 3, documentosFaltantes: 3, colorSemaforo: 'AMARILLO' },
    { posicion: 4, empresa: 'Mantenimiento Integral SAC', documentosVencidos: 2, documentosFaltantes: 3, colorSemaforo: 'AMARILLO' },
    { posicion: 5, empresa: 'Seguridad Total Perú', documentosVencidos: 1, documentosFaltantes: 3, colorSemaforo: 'AMARILLO' }
  ],
  proveedores: [
    {
      proveedor: 'Servicios Mineros del Sur',
      empleados: 156,
      activos: '45 (28H+17V)',
      materialesPeligrosos: 23,
      contratos: 5,
      estado: 'BLOQUEADO',
      acreditacion: 78,
      detalleContratos: [
        { numeroContrato: 'OC 4500029388', descripcion: 'Perforación y voladura - Zona Norte', empleados: 10, activos: 3, materialesPel: 8, fechaInicio: '01/11/2024', fechaFin: '31/03/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500028945', descripcion: 'Mantenimiento de maquinaria pesada', empleados: 25, activos: 12, materialesPel: 5, fechaInicio: '15/10/2024', fechaFin: '15/02/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500031256', descripcion: 'Servicios de topografía', empleados: 8, activos: 5, materialesPel: 0, fechaInicio: '01/12/2024', fechaFin: '30/04/2025', estadoContrato: 'PENDIENTE' },
        { numeroContrato: 'OC 4500027823', descripcion: 'Transporte de mineral', empleados: 45, activos: 18, materialesPel: 10, fechaInicio: '20/11/2024', fechaFin: '20/05/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500019874', descripcion: 'Instalación de sistemas de ventilación', empleados: 68, activos: 7, materialesPel: 0, fechaInicio: '01/08/2023', fechaFin: '31/01/2025', estadoContrato: 'POR VENCER' }
      ]
    },
    {
      proveedor: 'Construcciones Industriales SAA',
      empleados: 89,
      activos: '32 (20H+12V)',
      materialesPeligrosos: 15,
      contratos: 3,
      estado: 'BLOQUEADO',
      acreditacion: 65,
      detalleContratos: [
        { numeroContrato: 'OC 4500030178', descripcion: 'Construcción de almacén de suministros', empleados: 42, activos: 15, materialesPel: 8, fechaInicio: '01/10/2024', fechaFin: '30/06/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500030592', descripcion: 'Ampliación de oficinas administrativas', empleados: 28, activos: 10, materialesPel: 3, fechaInicio: '15/11/2024', fechaFin: '15/04/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500032045', descripcion: 'Instalación eléctrica - Planta nueva', empleados: 28, activos: 7, materialesPel: 4, fechaInicio: '01/12/2024', fechaFin: '28/02/2025', estadoContrato: 'PENDIENTE' }
      ]
    },
    {
      proveedor: 'Transportes Andinos EIRL',
      empleados: 234,
      activos: '67 (45H+22V)',
      materialesPeligrosos: 8,
      contratos: 8,
      estado: 'APTO',
      acreditacion: 92,
      detalleContratos: [
        { numeroContrato: 'OC 4500031245', descripcion: 'Transporte de personal - Turno A', empleados: 35, activos: 10, materialesPel: 0, fechaInicio: '01/01/2024', fechaFin: '31/12/2024', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500031246', descripcion: 'Transporte de personal - Turno B', empleados: 30, activos: 8, materialesPel: 0, fechaInicio: '01/01/2024', fechaFin: '31/12/2024', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500029871', descripcion: 'Logística y distribución', empleados: 45, activos: 15, materialesPel: 2, fechaInicio: '15/06/2024', fechaFin: '15/06/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500033012', descripcion: 'Transporte de maquinaria pesada', empleados: 25, activos: 12, materialesPel: 6, fechaInicio: '01/09/2024', fechaFin: '01/03/2025', estadoContrato: 'ACTIVA' }
      ]
    },
    {
      proveedor: 'Mantenimiento Integral SAC',
      empleados: 67,
      activos: '28 (18H+10V)',
      materialesPeligrosos: 12,
      contratos: 4,
      estado: 'PENDIENTE',
      acreditacion: 85,
      detalleContratos: [
        { numeroContrato: 'OC 4500028765', descripcion: 'Mantenimiento preventivo de equipos', empleados: 18, activos: 8, materialesPel: 4, fechaInicio: '01/07/2024', fechaFin: '30/06/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500030112', descripcion: 'Reparación de sistemas hidráulicos', empleados: 22, activos: 10, materialesPel: 3, fechaInicio: '15/08/2024', fechaFin: '15/02/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500031890', descripcion: 'Servicio de soldadura especializada', empleados: 15, activos: 6, materialesPel: 5, fechaInicio: '01/10/2024', fechaFin: '31/03/2025', estadoContrato: 'PENDIENTE' },
        { numeroContrato: 'OS 4500032156', descripcion: 'Mantenimiento de infraestructura', empleados: 12, activos: 4, materialesPel: 0, fechaInicio: '01/11/2024', fechaFin: '30/04/2025', estadoContrato: 'ACTIVA' }
      ]
    },
    {
      proveedor: 'Seguridad Total Perú',
      empleados: 145,
      activos: '41 (25H+16V)',
      materialesPeligrosos: 19,
      contratos: 6,
      estado: 'APTO',
      acreditacion: 88,
      detalleContratos: [
        { numeroContrato: 'OC 4500029012', descripcion: 'Vigilancia perimetral - Zona 1', empleados: 25, activos: 8, materialesPel: 0, fechaInicio: '01/01/2024', fechaFin: '31/12/2024', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500029013', descripcion: 'Vigilancia perimetral - Zona 2', empleados: 20, activos: 6, materialesPel: 0, fechaInicio: '01/01/2024', fechaFin: '31/12/2024', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500030245', descripcion: 'Seguridad industrial y prevención', empleados: 30, activos: 10, materialesPel: 15, fechaInicio: '01/06/2024', fechaFin: '31/05/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500031567', descripcion: 'Control de accesos vehiculares', empleados: 18, activos: 5, materialesPel: 0, fechaInicio: '15/07/2024', fechaFin: '15/07/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500032890', descripcion: 'Capacitación en seguridad', empleados: 12, activos: 2, materialesPel: 4, fechaInicio: '01/09/2024', fechaFin: '28/02/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500033145', descripcion: 'Monitoreo con cámaras de seguridad', empleados: 40, activos: 10, materialesPel: 0, fechaInicio: '01/10/2024', fechaFin: '30/09/2025', estadoContrato: 'ACTIVA' }
      ]
    }
  ]
};