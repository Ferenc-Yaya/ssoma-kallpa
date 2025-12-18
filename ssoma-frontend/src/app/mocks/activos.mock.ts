export interface Activo {
  activo_id: number;
  tenant_id: string;
  empresa_id: number;
  tipo_activo: 'VEHICULO' | 'HERRAMIENTA';
  codigo: string; // Placa para vehículo, Serie para herramienta
  descripcion: string;
  marca: string;
  modelo: string;
  placa?: string; // Solo para vehículos
  serie?: string; // Solo para herramientas
  estado: 'OPERATIVO' | 'MANTENIMIENTO' | 'FUERA_SERVICIO';
  metadata?: {
    año?: number;
    color?: string;
    capacidad?: string;
    potencia?: string;
    [key: string]: any;
  };
  documentos_vigentes: number;
  documentos_vencidos: number;
  created_at: string;
}

export const ACTIVOS_MOCK: Activo[] = [
  // VEHÍCULOS - Contratista KALLPA SAC (empresa_id: 1)
  {
    activo_id: 1,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_activo: 'VEHICULO',
    codigo: 'ABC-123',
    descripcion: 'Camioneta Pick-Up',
    marca: 'Toyota',
    modelo: 'Hilux',
    placa: 'ABC-123',
    estado: 'OPERATIVO',
    metadata: {
      año: 2022,
      color: 'Blanco',
      capacidad: '1000 kg'
    },
    documentos_vigentes: 3,
    documentos_vencidos: 0,
    created_at: '2024-01-15'
  },
  {
    activo_id: 2,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_activo: 'VEHICULO',
    codigo: 'XYZ-789',
    descripcion: 'Camión Volquete',
    marca: 'Volvo',
    modelo: 'FM 440',
    placa: 'XYZ-789',
    estado: 'OPERATIVO',
    metadata: {
      año: 2021,
      color: 'Amarillo',
      capacidad: '15 m³'
    },
    documentos_vigentes: 2,
    documentos_vencidos: 1,
    created_at: '2024-01-20'
  },
  {
    activo_id: 3,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_activo: 'VEHICULO',
    codigo: 'DEF-456',
    descripcion: 'Camioneta Panel',
    marca: 'Nissan',
    modelo: 'NP300',
    placa: 'DEF-456',
    estado: 'MANTENIMIENTO',
    metadata: {
      año: 2020,
      color: 'Gris',
      capacidad: '800 kg'
    },
    documentos_vigentes: 1,
    documentos_vencidos: 2,
    created_at: '2024-02-10'
  },

  // HERRAMIENTAS - Contratista KALLPA SAC (empresa_id: 1)
  {
    activo_id: 4,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_activo: 'HERRAMIENTA',
    codigo: 'H-001',
    descripcion: 'Compresor de Aire Industrial',
    marca: 'Atlas Copco',
    modelo: 'GA 75',
    serie: 'AC2024001',
    estado: 'OPERATIVO',
    metadata: {
      año: 2023,
      potencia: '75 kW',
      presion_maxima: '13 bar'
    },
    documentos_vigentes: 2,
    documentos_vencidos: 0,
    created_at: '2024-01-05'
  },
  {
    activo_id: 5,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_activo: 'HERRAMIENTA',
    codigo: 'H-002',
    descripcion: 'Taladro Percutor',
    marca: 'Bosch',
    modelo: 'GSB 16 RE',
    serie: 'TL2024002',
    estado: 'OPERATIVO',
    metadata: {
      año: 2023,
      potencia: '750 W',
      velocidad: '0-2800 rpm'
    },
    documentos_vigentes: 1,
    documentos_vencidos: 0,
    created_at: '2024-02-01'
  },

  // VEHÍCULOS - Servicios Mineros del Sur (empresa_id: 2)
  {
    activo_id: 6,
    tenant_id: 'KALLPA',
    empresa_id: 2,
    tipo_activo: 'VEHICULO',
    codigo: 'GHI-321',
    descripcion: 'Camioneta 4x4',
    marca: 'Mitsubishi',
    modelo: 'L200',
    placa: 'GHI-321',
    estado: 'OPERATIVO',
    metadata: {
      año: 2022,
      color: 'Negro',
      capacidad: '1200 kg'
    },
    documentos_vigentes: 3,
    documentos_vencidos: 0,
    created_at: '2024-01-10'
  },
  {
    activo_id: 7,
    tenant_id: 'KALLPA',
    empresa_id: 2,
    tipo_activo: 'VEHICULO',
    codigo: 'JKL-654',
    descripcion: 'Minibus',
    marca: 'Mercedes-Benz',
    modelo: 'Sprinter',
    placa: 'JKL-654',
    estado: 'OPERATIVO',
    metadata: {
      año: 2021,
      color: 'Blanco',
      capacidad: '19 pasajeros'
    },
    documentos_vigentes: 2,
    documentos_vencidos: 1,
    created_at: '2024-01-25'
  },

  // HERRAMIENTAS - Servicios Mineros del Sur (empresa_id: 2)
  {
    activo_id: 8,
    tenant_id: 'KALLPA',
    empresa_id: 2,
    tipo_activo: 'HERRAMIENTA',
    codigo: 'H-003',
    descripcion: 'Soldadora Eléctrica',
    marca: 'Lincoln',
    modelo: 'Power MIG 260',
    serie: 'SL2024003',
    estado: 'OPERATIVO',
    metadata: {
      año: 2023,
      potencia: '260 A',
      tipo: 'MIG/MAG'
    },
    documentos_vigentes: 1,
    documentos_vencidos: 0,
    created_at: '2024-02-15'
  }
];