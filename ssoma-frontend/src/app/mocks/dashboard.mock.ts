export interface DashboardStats {
  totalEmpresas: number;
  totalTrabajadores: number;
  documentosVencidos: number;
  semaforo: {
    apto: number;
    pendiente: number;
    bloqueado: number;
  };
  topOffenders: Array<{
    empresa: string;
    documentosRechazados: number;
    estado: 'CRITICO' | 'ADVERTENCIA';
  }>;
}

export const DASHBOARD_MOCK: DashboardStats = {
  totalEmpresas: 45,
  totalTrabajadores: 1250,
  documentosVencidos: 23,
  semaforo: {
    apto: 85,
    pendiente: 10,
    bloqueado: 5
  },
  topOffenders: [
    { empresa: 'Servicios Mineros del Sur', documentosRechazados: 12, estado: 'CRITICO' },
    { empresa: 'Construcciones Industriales SAA', documentosRechazados: 8, estado: 'CRITICO' },
    { empresa: 'Transportes Andinos EIRL', documentosRechazados: 6, estado: 'ADVERTENCIA' },
    { empresa: 'Mantenimiento Integral SAC', documentosRechazados: 5, estado: 'ADVERTENCIA' },
    { empresa: 'Seguridad Total Perú', documentosRechazados: 4, estado: 'ADVERTENCIA' }
  ]
};