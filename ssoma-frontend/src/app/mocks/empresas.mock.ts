export interface Empresa {
  id: number;
  tenant_id: string;
  ruc: string;
  razonSocial: string;
  tipo: 'PERMANENTE' | 'EVENTUAL' | 'VISITAS';
  direccion: string;
  telefono: string;
  email: string;
  estado: 'ACTIVO' | 'INACTIVO';
  created_at: string;
}

export const EMPRESAS_MOCK: Empresa[] = [
  {
    id: 1,
    tenant_id: 'KALLPA',
    ruc: '20123456789',
    razonSocial: 'Contratista KALLPA SAC',
    tipo: 'PERMANENTE',
    direccion: 'Av. Javier Prado Este 5268, La Molina, Lima',
    telefono: '01-4567890',
    email: 'contacto@contratistakallpa.com',
    estado: 'ACTIVO',
    created_at: '2024-01-15T10:30:00'
  },
  {
    id: 2,
    tenant_id: 'KALLPA',
    ruc: '20987654321',
    razonSocial: 'Servicios Mineros del Sur',
    tipo: 'EVENTUAL',
    direccion: 'Jr. Los Alamos 450, San Borja, Lima',
    telefono: '01-2345678',
    email: 'info@minerossur.com',
    estado: 'ACTIVO',
    created_at: '2024-03-20T14:15:00'
  },
  {
    id: 3,
    tenant_id: 'KALLPA',
    ruc: '20456789123',
    razonSocial: 'Construcciones Industriales SAA',
    tipo: 'PERMANENTE',
    direccion: 'Av. República de Panamá 3635, San Isidro, Lima',
    telefono: '01-9876543',
    email: 'contacto@construindustrial.com',
    estado: 'ACTIVO',
    created_at: '2024-02-10T09:00:00'
  },
  {
    id: 4,
    tenant_id: 'KALLPA',
    ruc: '20789456123',
    razonSocial: 'Consultores Externos EIRL',
    tipo: 'VISITAS',
    direccion: 'Calle Las Begonias 475, San Isidro, Lima',
    telefono: '01-5554321',
    email: 'admin@consultoresext.com',
    estado: 'INACTIVO',
    created_at: '2024-05-05T11:20:00'
  }
];