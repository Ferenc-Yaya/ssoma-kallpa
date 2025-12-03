export interface Empresa {
  id: number;
  razonSocial: string;
  ruc: string;
  tipo: 'PERMANENTE' | 'EVENTUAL';
  estadoHabilitacion: 'APTO' | 'OBSERVADO' | 'PENDIENTE';
}

export const EMPRESAS_MOCK: Empresa[] = [
  {
    id: 1,
    razonSocial: 'Contratista KALLPA SAC',
    ruc: '20123456789',
    tipo: 'PERMANENTE',
    estadoHabilitacion: 'APTO'
  },
  {
    id: 2,
    razonSocial: 'Servicios Mineros del Sur',
    ruc: '20987654321',
    tipo: 'EVENTUAL',
    estadoHabilitacion: 'OBSERVADO'
  },
  {
    id: 3,
    razonSocial: 'Construcciones Industriales SAA',
    ruc: '20456789123',
    tipo: 'PERMANENTE',
    estadoHabilitacion: 'PENDIENTE'
  }
];