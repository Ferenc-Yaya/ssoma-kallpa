export interface ContratoContratista {
  id: string;
  numero: string;
  descripcion: string;
  sede: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'nuevo' | 'habilitado' | 'parcial' | 'finalizado';
  porcentajeCumplimiento: number;
  personal: { habilitados: number; total: number };
  vehiculos: { habilitados: number; total: number };
  herramientas: { habilitados: number; total: number };
}

export interface ContratistaMock {
  id: string;
  razonSocial: string;
  ruc: string;
  representanteLegal: string;
  telefono: string;
  email: string;
  tipoContratista: string;
  estado: 'habilitado' | 'parcial' | 'bloqueado' | 'nuevo';
  porcentajeCumplimiento: number;
  contratos: ContratoContratista[];
  resumen: {
    contratosActivos: number;
    contratosTotal: number;
    personalHabilitado: number;
    personalTotal: number;
    documentosVencidos: number;
    documentosPorVencer: number;
  };
}

export const CONTRATISTAS_MOCK: ContratistaMock[] = [
  {
    id: '1',
    razonSocial: 'Constructora Andina S.A.C.',
    ruc: '20456789123',
    representanteLegal: 'Carlos Mendoza Ríos',
    telefono: '01-4567890',
    email: 'contacto@constructoraandina.com',
    tipoContratista: 'Construcción',
    estado: 'habilitado',
    porcentajeCumplimiento: 94,
    contratos: [
      {
        id: '1',
        numero: 'OC 4500030125',
        descripcion: 'Mantenimiento de instalaciones eléctricas',
        sede: 'Cañón del Pato',
        fechaInicio: '2024-01-15',
        fechaFin: '2024-12-31',
        estado: 'habilitado',
        porcentajeCumplimiento: 93,
        personal: { habilitados: 11, total: 12 },
        vehiculos: { habilitados: 2, total: 2 },
        herramientas: { habilitados: 5, total: 5 }
      },
      {
        id: '2',
        numero: 'OS 4500028734',
        descripcion: 'Servicio de limpieza industrial',
        sede: 'Cerro del Águila',
        fechaInicio: '2024-02-01',
        fechaFin: '2024-06-30',
        estado: 'habilitado',
        porcentajeCumplimiento: 95,
        personal: { habilitados: 18, total: 18 },
        vehiculos: { habilitados: 3, total: 3 },
        herramientas: { habilitados: 8, total: 8 }
      }
    ],
    resumen: {
      contratosActivos: 2,
      contratosTotal: 2,
      personalHabilitado: 29,
      personalTotal: 30,
      documentosVencidos: 0,
      documentosPorVencer: 3
    }
  },
  {
    id: '2',
    razonSocial: 'Servicios Industriales del Norte E.I.R.L.',
    ruc: '20567891234',
    representanteLegal: 'María López García',
    telefono: '01-5678901',
    email: 'info@servinorte.com',
    tipoContratista: 'Servicios',
    estado: 'parcial',
    porcentajeCumplimiento: 72,
    contratos: [
      {
        id: '3',
        numero: 'OC 4500029156',
        descripcion: 'Instalación de sistema contra incendios',
        sede: 'Cañón del Pato',
        fechaInicio: '2024-03-01',
        fechaFin: '2024-08-31',
        estado: 'parcial',
        porcentajeCumplimiento: 65,
        personal: { habilitados: 5, total: 10 },
        vehiculos: { habilitados: 1, total: 2 },
        herramientas: { habilitados: 4, total: 8 }
      },
      {
        id: '4',
        numero: 'OS 4500027892',
        descripcion: 'Mantenimiento de equipos de climatización',
        sede: 'Cerro del Águila',
        fechaInicio: '2024-04-01',
        fechaFin: '2024-12-31',
        estado: 'parcial',
        porcentajeCumplimiento: 78,
        personal: { habilitados: 6, total: 8 },
        vehiculos: { habilitados: 2, total: 2 },
        herramientas: { habilitados: 10, total: 12 }
      }
    ],
    resumen: {
      contratosActivos: 2,
      contratosTotal: 2,
      personalHabilitado: 11,
      personalTotal: 18,
      documentosVencidos: 5,
      documentosPorVencer: 8
    }
  },
  {
    id: '3',
    razonSocial: 'Transportes y Logística SAC',
    ruc: '20678912345',
    representanteLegal: 'Jorge Ramírez Vega',
    telefono: '01-6789012',
    email: 'operaciones@translog.pe',
    tipoContratista: 'Transporte',
    estado: 'habilitado',
    porcentajeCumplimiento: 100,
    contratos: [
      {
        id: '5',
        numero: 'OS 4500026543',
        descripcion: 'Servicio de transporte de personal',
        sede: 'Cerro del Águila',
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        estado: 'habilitado',
        porcentajeCumplimiento: 100,
        personal: { habilitados: 15, total: 15 },
        vehiculos: { habilitados: 8, total: 8 },
        herramientas: { habilitados: 0, total: 0 }
      }
    ],
    resumen: {
      contratosActivos: 1,
      contratosTotal: 1,
      personalHabilitado: 15,
      personalTotal: 15,
      documentosVencidos: 0,
      documentosPorVencer: 0
    }
  },
  {
    id: '4',
    razonSocial: 'Seguridad Integral Perú S.A.',
    ruc: '20789123456',
    representanteLegal: 'Ana Torres Medina',
    telefono: '01-7890123',
    email: 'seguridad@siperu.com',
    tipoContratista: 'Vigilancia',
    estado: 'habilitado',
    porcentajeCumplimiento: 98,
    contratos: [
      {
        id: '6',
        numero: 'OS 4500025891',
        descripcion: 'Servicio de vigilancia y seguridad',
        sede: 'Cañón del Pato',
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        estado: 'habilitado',
        porcentajeCumplimiento: 98,
        personal: { habilitados: 24, total: 25 },
        vehiculos: { habilitados: 3, total: 3 },
        herramientas: { habilitados: 5, total: 5 }
      }
    ],
    resumen: {
      contratosActivos: 1,
      contratosTotal: 1,
      personalHabilitado: 24,
      personalTotal: 25,
      documentosVencidos: 0,
      documentosPorVencer: 1
    }
  },
  {
    id: '5',
    razonSocial: 'Metalmecánica del Sur S.A.C.',
    ruc: '20891234567',
    representanteLegal: 'Roberto Sánchez Luna',
    telefono: '01-8901234',
    email: 'ventas@metalsur.com',
    tipoContratista: 'Metalmecánica',
    estado: 'bloqueado',
    porcentajeCumplimiento: 35,
    contratos: [
      {
        id: '7',
        numero: 'OC 4500029821',
        descripcion: 'Reparación de estructuras metálicas',
        sede: 'Cañón del Pato',
        fechaInicio: '2024-06-01',
        fechaFin: '2024-08-31',
        estado: 'parcial',
        porcentajeCumplimiento: 35,
        personal: { habilitados: 3, total: 10 },
        vehiculos: { habilitados: 1, total: 3 },
        herramientas: { habilitados: 2, total: 8 }
      }
    ],
    resumen: {
      contratosActivos: 1,
      contratosTotal: 1,
      personalHabilitado: 3,
      personalTotal: 10,
      documentosVencidos: 12,
      documentosPorVencer: 5
    }
  },
  {
    id: '6',
    razonSocial: 'Soldaduras Especiales E.I.R.L.',
    ruc: '20912345678',
    representanteLegal: 'Pedro Flores Castro',
    telefono: '01-9012345',
    email: 'contacto@soldesp.com',
    tipoContratista: 'Soldadura',
    estado: 'nuevo',
    porcentajeCumplimiento: 0,
    contratos: [
      {
        id: '8',
        numero: 'OC 4500030478',
        descripcion: 'Servicio de soldadura - Proyecto Ampliación',
        sede: 'Cañón del Pato',
        fechaInicio: '2024-07-01',
        fechaFin: '2024-12-31',
        estado: 'nuevo',
        porcentajeCumplimiento: 0,
        personal: { habilitados: 0, total: 0 },
        vehiculos: { habilitados: 0, total: 0 },
        herramientas: { habilitados: 0, total: 0 }
      }
    ],
    resumen: {
      contratosActivos: 0,
      contratosTotal: 1,
      personalHabilitado: 0,
      personalTotal: 0,
      documentosVencidos: 0,
      documentosPorVencer: 0
    }
  },
  {
    id: '7',
    razonSocial: 'Mantenimiento Industrial Global S.A.',
    ruc: '20123456789',
    representanteLegal: 'Luis García Pérez',
    telefono: '01-1234567',
    email: 'info@miglobal.pe',
    tipoContratista: 'Mantenimiento',
    estado: 'parcial',
    porcentajeCumplimiento: 82,
    contratos: [
      {
        id: '9',
        numero: 'OC 4500029467',
        descripcion: 'Construcción de almacén temporal',
        sede: 'Cañón del Pato',
        fechaInicio: '2024-05-15',
        fechaFin: '2024-09-30',
        estado: 'parcial',
        porcentajeCumplimiento: 80,
        personal: { habilitados: 20, total: 25 },
        vehiculos: { habilitados: 5, total: 6 },
        herramientas: { habilitados: 15, total: 18 }
      },
      {
        id: '10',
        numero: 'OS 4500028156',
        descripcion: 'Mantenimiento preventivo general',
        sede: 'Cerro del Águila',
        fechaInicio: '2024-03-01',
        fechaFin: '2024-12-31',
        estado: 'habilitado',
        porcentajeCumplimiento: 85,
        personal: { habilitados: 12, total: 14 },
        vehiculos: { habilitados: 4, total: 4 },
        herramientas: { habilitados: 20, total: 22 }
      }
    ],
    resumen: {
      contratosActivos: 2,
      contratosTotal: 2,
      personalHabilitado: 32,
      personalTotal: 39,
      documentosVencidos: 2,
      documentosPorVencer: 6
    }
  },
  {
    id: '8',
    razonSocial: 'Electricidad y Control SAC',
    ruc: '20234567891',
    representanteLegal: 'Carmen Díaz Rojas',
    telefono: '01-2345678',
    email: 'proyectos@eleccontrol.com',
    tipoContratista: 'Electricidad',
    estado: 'habilitado',
    porcentajeCumplimiento: 91,
    contratos: [
      {
        id: '11',
        numero: 'OC 4500027634',
        descripcion: 'Instalación de tableros eléctricos',
        sede: 'Cañón del Pato',
        fechaInicio: '2024-02-01',
        fechaFin: '2024-07-31',
        estado: 'habilitado',
        porcentajeCumplimiento: 91,
        personal: { habilitados: 8, total: 9 },
        vehiculos: { habilitados: 2, total: 2 },
        herramientas: { habilitados: 12, total: 13 }
      }
    ],
    resumen: {
      contratosActivos: 1,
      contratosTotal: 1,
      personalHabilitado: 8,
      personalTotal: 9,
      documentosVencidos: 0,
      documentosPorVencer: 2
    }
  }
];
