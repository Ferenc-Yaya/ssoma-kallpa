export interface Alerta {
  tipo: 'vencimiento' | 'observacion' | 'urgente';
  descripcion: string;
  diasRestantes?: number;
}

export interface RecursoContrato {
  nombre: string;
  icono: string;
  habilitados: number;
  total: number;
  porVencer: number;
  vencidos: number;
}

export interface ContratoMock {
  id: string;
  numero: string;
  descripcion: string;
  empresaPrincipal: string;
  sede: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'nuevo' | 'habilitado' | 'parcial' | 'finalizado';
  porcentajeCumplimiento: number;
  alertas: Alerta[];
  recursos: RecursoContrato[];
  observacionesPendientes: number;
  esNuevo?: boolean;
}

export const CONTRATOS_MOCK: ContratoMock[] = [
  // CONTRATO NUEVO - Recién asignado por empresa principal
  {
    id: '0',
    numero: 'OC 4500030478',
    descripcion: 'Servicio de soldadura y montaje estructural - Proyecto Ampliación',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cañón del Pato',
    fechaInicio: '2024-07-01',
    fechaFin: '2024-12-31',
    estado: 'nuevo',
    porcentajeCumplimiento: 0,
    alertas: [
      { tipo: 'urgente', descripcion: 'Contrato nuevo - Requiere inicio de acreditación' }
    ],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Documentos', icono: 'description', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 }
    ],
    observacionesPendientes: 0,
    esNuevo: true
  },
  {
    id: '1',
    numero: 'OC 4500030125',
    descripcion: 'Mantenimiento de instalaciones eléctricas - Sede Central',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cañón del Pato',
    fechaInicio: '2024-01-15',
    fechaFin: '2024-12-31',
    estado: 'habilitado',
    porcentajeCumplimiento: 93,
    alertas: [],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 11, total: 12, porVencer: 2, vencidos: 1 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 5, total: 5, porVencer: 1, vencidos: 0 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 2, total: 2, porVencer: 0, vencidos: 0 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Documentos', icono: 'description', habilitados: 8, total: 8, porVencer: 1, vencidos: 0 }
    ],
    observacionesPendientes: 0
  },
  {
    id: '2',
    numero: 'OS 4500028734',
    descripcion: 'Servicio de limpieza industrial - Planta Norte',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cerro del Águila',
    fechaInicio: '2024-02-01',
    fechaFin: '2024-06-30',
    estado: 'parcial',
    porcentajeCumplimiento: 78,
    alertas: [],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 18, total: 22, porVencer: 3, vencidos: 1 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 8, total: 10, porVencer: 1, vencidos: 1 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 3, total: 4, porVencer: 1, vencidos: 0 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 5, total: 6, porVencer: 0, vencidos: 1 },
      { nombre: 'Documentos', icono: 'description', habilitados: 6, total: 8, porVencer: 2, vencidos: 0 }
    ],
    observacionesPendientes: 2
  },
  {
    id: '3',
    numero: 'OC 4500029156',
    descripcion: 'Instalación de sistema contra incendios',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cañón del Pato',
    fechaInicio: '2024-03-01',
    fechaFin: '2024-08-31',
    estado: 'parcial',
    porcentajeCumplimiento: 35,
    alertas: [],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 5, total: 15, porVencer: 2, vencidos: 3 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 2, total: 8, porVencer: 0, vencidos: 2 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 1, total: 3, porVencer: 1, vencidos: 1 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Documentos', icono: 'description', habilitados: 3, total: 10, porVencer: 2, vencidos: 3 }
    ],
    observacionesPendientes: 5
  },
  {
    id: '4',
    numero: 'OS 4500027892',
    descripcion: 'Mantenimiento preventivo de equipos de climatización',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cerro del Águila',
    fechaInicio: '2024-04-01',
    fechaFin: '2024-12-31',
    estado: 'habilitado',
    porcentajeCumplimiento: 100,
    alertas: [],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 8, total: 8, porVencer: 0, vencidos: 0 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 12, total: 12, porVencer: 0, vencidos: 0 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 2, total: 2, porVencer: 0, vencidos: 0 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Documentos', icono: 'description', habilitados: 6, total: 6, porVencer: 0, vencidos: 0 }
    ],
    observacionesPendientes: 0
  },
  {
    id: '5',
    numero: 'OC 4500029467',
    descripcion: 'Construcción de almacén temporal',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cañón del Pato',
    fechaInicio: '2024-05-15',
    fechaFin: '2024-09-30',
    estado: 'parcial',
    porcentajeCumplimiento: 80,
    alertas: [],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 20, total: 25, porVencer: 3, vencidos: 0 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 15, total: 18, porVencer: 2, vencidos: 1 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 5, total: 6, porVencer: 1, vencidos: 0 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 8, total: 10, porVencer: 1, vencidos: 1 },
      { nombre: 'Documentos', icono: 'description', habilitados: 10, total: 12, porVencer: 2, vencidos: 0 }
    ],
    observacionesPendientes: 1
  },
  {
    id: '6',
    numero: 'OS 4500026543',
    descripcion: 'Servicio de vigilancia y seguridad',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cerro del Águila',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    estado: 'habilitado',
    porcentajeCumplimiento: 100,
    alertas: [],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 30, total: 30, porVencer: 0, vencidos: 0 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 5, total: 5, porVencer: 0, vencidos: 0 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 3, total: 3, porVencer: 0, vencidos: 0 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Documentos', icono: 'description', habilitados: 12, total: 12, porVencer: 0, vencidos: 0 }
    ],
    observacionesPendientes: 0
  },
  {
    id: '7',
    numero: 'OC 4500029821',
    descripcion: 'Reparación de techos y estructuras metálicas',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cañón del Pato',
    fechaInicio: '2024-06-01',
    fechaFin: '2024-08-31',
    estado: 'parcial',
    porcentajeCumplimiento: 72,
    alertas: [],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 10, total: 14, porVencer: 2, vencidos: 2 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 6, total: 8, porVencer: 1, vencidos: 1 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 2, total: 3, porVencer: 0, vencidos: 1 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Documentos', icono: 'description', habilitados: 5, total: 8, porVencer: 1, vencidos: 2 }
    ],
    observacionesPendientes: 3
  },
  {
    id: '8',
    numero: 'OS 4500025187',
    descripcion: 'Servicio de transporte - Campaña 2023',
    empresaPrincipal: 'Kallpa Generación',
    sede: 'Cerro del Águila',
    fechaInicio: '2023-03-01',
    fechaFin: '2023-12-31',
    estado: 'finalizado',
    porcentajeCumplimiento: 100,
    alertas: [],
    recursos: [
      { nombre: 'Personal', icono: 'people', habilitados: 10, total: 10, porVencer: 0, vencidos: 0 },
      { nombre: 'Herramientas', icono: 'construction', habilitados: 6, total: 6, porVencer: 0, vencidos: 0 },
      { nombre: 'Vehículos', icono: 'local_shipping', habilitados: 8, total: 8, porVencer: 0, vencidos: 0 },
      { nombre: 'Mat. Peligrosos', icono: 'warning', habilitados: 0, total: 0, porVencer: 0, vencidos: 0 },
      { nombre: 'Documentos', icono: 'description', habilitados: 10, total: 10, porVencer: 0, vencidos: 0 }
    ],
    observacionesPendientes: 0
  }
];
