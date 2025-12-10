export interface Trabajador {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  empresaId: number;
  empresaNombre: string;
  cargo: string;
  foto?: string;
  estadoAcreditacion: 'APTO' | 'OBSERVADO' | 'PENDIENTE' | 'BLOQUEADO';
  fechaVencimiento?: string;
  documentosAprobados: {
    tipo: string;
    fechaAprobacion: string;
    vigencia: string;
  }[];
}

export const TRABAJADORES_MOCK: Trabajador[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellidos: 'Pérez García',
    dni: '43218765',
    empresaId: 1,
    empresaNombre: 'Contratista KALLPA SAC',
    cargo: 'Operador de Maquinaria',
    foto: 'https://i.pravatar.cc/300?img=12',
    estadoAcreditacion: 'APTO',
    fechaVencimiento: '2025-06-30',
    documentosAprobados: [
      { tipo: 'DNI', fechaAprobacion: '2024-12-01', vigencia: '2029-12-01' },
      { tipo: 'Certificado Médico', fechaAprobacion: '2024-12-02', vigencia: '2025-06-02' },
      { tipo: 'SCTR', fechaAprobacion: '2024-11-28', vigencia: '2025-11-28' },
      { tipo: 'Curso de Alturas', fechaAprobacion: '2024-11-15', vigencia: '2026-11-15' }
    ]
  },
  {
    id: 2,
    nombre: 'María',
    apellidos: 'López Silva',
    dni: '45678912',
    empresaId: 1,
    empresaNombre: 'Contratista KALLPA SAC',
    cargo: 'Supervisor de Seguridad',
    foto: 'https://i.pravatar.cc/300?img=5',
    estadoAcreditacion: 'APTO',
    fechaVencimiento: '2025-08-15',
    documentosAprobados: [
      { tipo: 'DNI', fechaAprobacion: '2024-11-20', vigencia: '2028-11-20' },
      { tipo: 'Certificado Médico', fechaAprobacion: '2024-11-21', vigencia: '2025-05-21' },
      { tipo: 'SCTR', fechaAprobacion: '2024-11-28', vigencia: '2025-11-28' }
    ]
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellidos: 'Rojas Mendoza',
    dni: '41234567',
    empresaId: 3,
    empresaNombre: 'Construcciones Industriales SAA',
    cargo: 'Técnico Electricista',
    foto: 'https://i.pravatar.cc/300?img=33',
    estadoAcreditacion: 'OBSERVADO',
    fechaVencimiento: '2025-03-10',
    documentosAprobados: [
      { tipo: 'DNI', fechaAprobacion: '2024-10-15', vigencia: '2027-10-15' },
      { tipo: 'Certificado Médico', fechaAprobacion: '2024-10-20', vigencia: '2025-04-20' }
    ]
  },
  {
    id: 4,
    nombre: 'Ana',
    apellidos: 'Torres Vargas',
    dni: '47896541',
    empresaId: 2,
    empresaNombre: 'Servicios Mineros del Sur',
    cargo: 'Ingeniera de Campo',
    foto: 'https://i.pravatar.cc/300?img=9',
    estadoAcreditacion: 'PENDIENTE',
    documentosAprobados: [
      { tipo: 'DNI', fechaAprobacion: '2024-12-01', vigencia: '2029-12-01' }
    ]
  }
];