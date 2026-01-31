export interface DashboardStats {
  // Semáforos principales
  semaforos: {
    habilitados: number;
    porVencer: number;
    incumplimientos: number;
  };

  // Resumen de documentos
  documentos: {
    aprobados: number;
    enRevision: number;
    observados: number;
    vencidos: number;
    porVencer: number;
  };

  // Resumen de personal
  personal: {
    habilitados: number;
    inhabilitados: number;
    total: number;
  };

  // Resumen de vehículos
  vehiculos: {
    habilitados: number;
    inhabilitados: number;
    total: number;
  };

  // Resumen de equipos
  equipos: {
    habilitados: number;
    inhabilitados: number;
    total: number;
  };

  // Alertas de vencimientos
  alertasVencimientos: {
    hoy: number;
    tresDias: number;
    sieteDias: number;
    quinceDias: number;
  };

  // Problemas detectados
  problemas: {
    documentosSinRevisar: number;
    observacionesSinRespuesta: number;
    contratistasAltoIndice: number;
    erroresRecurrentes: number;
    incumplimientosReiterativos: number;
  };

  // Semáforo general (para el chart)
  semaforo: {
    apto: number;
    pendiente: number;
    bloqueado: number;
  };

  // Top 5 Observaciones
  topObservaciones: Array<{
    posicion: number;
    empresa: string;
    documentosVencidos: number;
    documentosFaltantes: number;
    colorSemaforo: 'VERDE' | 'AMARILLO' | 'ROJO';
  }>;

  // Detalle de alertas
  detalleAlertas: Array<{
    tipo: 'vencimiento' | 'observacion' | 'incumplimiento';
    prioridad: 'alta' | 'media' | 'baja';
    contratista: string;
    documento: string;
    diasRestantes?: number;
    fechaVencimiento?: string;
    mensaje: string;
  }>;

  // Proveedores
  proveedores: Array<{
    proveedor: string;
    ruc: string;
    servicioOC: string;
    empleados: number;
    activos: string;
    materialesPeligrosos: number;
    contratos: number;
    estado: 'BLOQUEADO' | 'APTO' | 'PENDIENTE';
    acreditacion: number;
    cumplimiento: number;
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

  // Ranking de contratistas
  rankingMejores: Array<{
    posicion: number;
    empresa: string;
    cumplimiento: number;
  }>;

  rankingPeores: Array<{
    posicion: number;
    empresa: string;
    cumplimiento: number;
    observaciones: number;
  }>;
}

export const DASHBOARD_MOCK: DashboardStats = {
  semaforos: {
    habilitados: 85,
    porVencer: 12,
    incumplimientos: 8
  },

  documentos: {
    aprobados: 450,
    enRevision: 28,
    observados: 15,
    vencidos: 12,
    porVencer: 25
  },

  personal: {
    habilitados: 320,
    inhabilitados: 15,
    total: 335
  },

  vehiculos: {
    habilitados: 45,
    inhabilitados: 8,
    total: 53
  },

  equipos: {
    habilitados: 78,
    inhabilitados: 5,
    total: 83
  },

  alertasVencimientos: {
    hoy: 3,
    tresDias: 8,
    sieteDias: 12,
    quinceDias: 25
  },

  problemas: {
    documentosSinRevisar: 28,
    observacionesSinRespuesta: 15,
    contratistasAltoIndice: 5,
    erroresRecurrentes: 12,
    incumplimientosReiterativos: 8
  },

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

  detalleAlertas: [
    { tipo: 'vencimiento', prioridad: 'alta', contratista: 'Servicios Mineros del Sur', documento: 'SCTR Salud', diasRestantes: 0, fechaVencimiento: '31/01/2026', mensaje: 'Vence HOY' },
    { tipo: 'vencimiento', prioridad: 'alta', contratista: 'Construcciones Industriales', documento: 'Póliza RC', diasRestantes: 0, fechaVencimiento: '31/01/2026', mensaje: 'Vence HOY' },
    { tipo: 'vencimiento', prioridad: 'alta', contratista: 'Transportes Andinos', documento: 'SOAT Vehículo PLX-123', diasRestantes: 0, fechaVencimiento: '31/01/2026', mensaje: 'Vence HOY' },
    { tipo: 'vencimiento', prioridad: 'alta', contratista: 'Servicios Mineros del Sur', documento: 'Certificado Altura - Juan Pérez', diasRestantes: 2, fechaVencimiento: '02/02/2026', mensaje: 'Vence en 2 días' },
    { tipo: 'vencimiento', prioridad: 'media', contratista: 'Mantenimiento Integral', documento: 'EMO - Carlos García', diasRestantes: 5, fechaVencimiento: '05/02/2026', mensaje: 'Vence en 5 días' },
    { tipo: 'observacion', prioridad: 'alta', contratista: 'Construcciones Industriales', documento: 'Contrato de trabajo', mensaje: 'Sin respuesta hace 5 días' },
    { tipo: 'observacion', prioridad: 'media', contratista: 'Seguridad Total', documento: 'Licencia de conducir', mensaje: 'Sin respuesta hace 3 días' },
    { tipo: 'incumplimiento', prioridad: 'alta', contratista: 'Servicios Mineros del Sur', documento: 'Plan de seguridad', mensaje: 'Incumplimiento reiterativo (3ra vez)' }
  ],

  proveedores: [
    {
      proveedor: 'Servicios Mineros del Sur',
      ruc: '20512345678',
      servicioOC: 'OC 4500029388',
      empleados: 156,
      activos: '45 (28H+17V)',
      materialesPeligrosos: 23,
      contratos: 5,
      estado: 'BLOQUEADO',
      acreditacion: 78,
      cumplimiento: 65,
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
      ruc: '20523456789',
      servicioOC: 'OC 4500030178',
      empleados: 89,
      activos: '32 (20H+12V)',
      materialesPeligrosos: 15,
      contratos: 3,
      estado: 'BLOQUEADO',
      acreditacion: 65,
      cumplimiento: 52,
      detalleContratos: [
        { numeroContrato: 'OC 4500030178', descripcion: 'Construcción de almacén de suministros', empleados: 42, activos: 15, materialesPel: 8, fechaInicio: '01/10/2024', fechaFin: '30/06/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500030592', descripcion: 'Ampliación de oficinas administrativas', empleados: 28, activos: 10, materialesPel: 3, fechaInicio: '15/11/2024', fechaFin: '15/04/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500032045', descripcion: 'Instalación eléctrica - Planta nueva', empleados: 28, activos: 7, materialesPel: 4, fechaInicio: '01/12/2024', fechaFin: '28/02/2025', estadoContrato: 'PENDIENTE' }
      ]
    },
    {
      proveedor: 'Transportes Andinos EIRL',
      ruc: '20534567890',
      servicioOC: 'OC 4500031245',
      empleados: 234,
      activos: '67 (45H+22V)',
      materialesPeligrosos: 8,
      contratos: 8,
      estado: 'APTO',
      acreditacion: 92,
      cumplimiento: 95,
      detalleContratos: [
        { numeroContrato: 'OC 4500031245', descripcion: 'Transporte de personal - Turno A', empleados: 35, activos: 10, materialesPel: 0, fechaInicio: '01/01/2024', fechaFin: '31/12/2024', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500031246', descripcion: 'Transporte de personal - Turno B', empleados: 30, activos: 8, materialesPel: 0, fechaInicio: '01/01/2024', fechaFin: '31/12/2024', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500029871', descripcion: 'Logística y distribución', empleados: 45, activos: 15, materialesPel: 2, fechaInicio: '15/06/2024', fechaFin: '15/06/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500033012', descripcion: 'Transporte de maquinaria pesada', empleados: 25, activos: 12, materialesPel: 6, fechaInicio: '01/09/2024', fechaFin: '01/03/2025', estadoContrato: 'ACTIVA' }
      ]
    },
    {
      proveedor: 'Mantenimiento Integral SAC',
      ruc: '20545678901',
      servicioOC: 'OC 4500028765',
      empleados: 67,
      activos: '28 (18H+10V)',
      materialesPeligrosos: 12,
      contratos: 4,
      estado: 'PENDIENTE',
      acreditacion: 85,
      cumplimiento: 78,
      detalleContratos: [
        { numeroContrato: 'OC 4500028765', descripcion: 'Mantenimiento preventivo de equipos', empleados: 18, activos: 8, materialesPel: 4, fechaInicio: '01/07/2024', fechaFin: '30/06/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500030112', descripcion: 'Reparación de sistemas hidráulicos', empleados: 22, activos: 10, materialesPel: 3, fechaInicio: '15/08/2024', fechaFin: '15/02/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500031890', descripcion: 'Servicio de soldadura especializada', empleados: 15, activos: 6, materialesPel: 5, fechaInicio: '01/10/2024', fechaFin: '31/03/2025', estadoContrato: 'PENDIENTE' },
        { numeroContrato: 'OS 4500032156', descripcion: 'Mantenimiento de infraestructura', empleados: 12, activos: 4, materialesPel: 0, fechaInicio: '01/11/2024', fechaFin: '30/04/2025', estadoContrato: 'ACTIVA' }
      ]
    },
    {
      proveedor: 'Seguridad Total Perú',
      ruc: '20556789012',
      servicioOC: 'OC 4500029012',
      empleados: 145,
      activos: '41 (25H+16V)',
      materialesPeligrosos: 19,
      contratos: 6,
      estado: 'APTO',
      acreditacion: 88,
      cumplimiento: 91,
      detalleContratos: [
        { numeroContrato: 'OC 4500029012', descripcion: 'Vigilancia perimetral - Zona 1', empleados: 25, activos: 8, materialesPel: 0, fechaInicio: '01/01/2024', fechaFin: '31/12/2024', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500029013', descripcion: 'Vigilancia perimetral - Zona 2', empleados: 20, activos: 6, materialesPel: 0, fechaInicio: '01/01/2024', fechaFin: '31/12/2024', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500030245', descripcion: 'Seguridad industrial y prevención', empleados: 30, activos: 10, materialesPel: 15, fechaInicio: '01/06/2024', fechaFin: '31/05/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500031567', descripcion: 'Control de accesos vehiculares', empleados: 18, activos: 5, materialesPel: 0, fechaInicio: '15/07/2024', fechaFin: '15/07/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OS 4500032890', descripcion: 'Capacitación en seguridad', empleados: 12, activos: 2, materialesPel: 4, fechaInicio: '01/09/2024', fechaFin: '28/02/2025', estadoContrato: 'ACTIVA' },
        { numeroContrato: 'OC 4500033145', descripcion: 'Monitoreo con cámaras de seguridad', empleados: 40, activos: 10, materialesPel: 0, fechaInicio: '01/10/2024', fechaFin: '30/09/2025', estadoContrato: 'ACTIVA' }
      ]
    }
  ],

  rankingMejores: [
    { posicion: 1, empresa: 'Transportes Andinos EIRL', cumplimiento: 95 },
    { posicion: 2, empresa: 'Seguridad Total Perú', cumplimiento: 91 },
    { posicion: 3, empresa: 'Logística Norte SAC', cumplimiento: 89 },
    { posicion: 4, empresa: 'Equipos Industriales', cumplimiento: 87 },
    { posicion: 5, empresa: 'Servicios Técnicos ABC', cumplimiento: 85 }
  ],

  rankingPeores: [
    { posicion: 1, empresa: 'Construcciones Industriales SAA', cumplimiento: 52, observaciones: 18 },
    { posicion: 2, empresa: 'Servicios Mineros del Sur', cumplimiento: 65, observaciones: 12 },
    { posicion: 3, empresa: 'Metalmecánica XYZ', cumplimiento: 68, observaciones: 9 },
    { posicion: 4, empresa: 'Obras Civiles Lima', cumplimiento: 71, observaciones: 7 },
    { posicion: 5, empresa: 'Instalaciones Eléctricas', cumplimiento: 74, observaciones: 5 }
  ]
};
