export interface Persona {
  persona_id: number;
  tenant_id: string;
  empresa_id: number;
  tipo_documento: 'DNI' | 'CE' | 'PASAPORTE';
  numero_documento: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  cargo: string;
  estado: 'ACTIVO' | 'INACTIVO';
  estado_acreditacion: 'APTO' | 'OBSERVADO' | 'PENDIENTE';
  foto?: string;
  created_at: string;
}

export const PERSONAS_MOCK: Persona[] = [
  // Empresa 1: Contratista KALLPA SAC
  {
    persona_id: 1,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_documento: 'DNI',
    numero_documento: '43218765',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez García',
    fecha_nacimiento: '1985-05-15',
    telefono: '987654321',
    email: 'jperez@contratistakallpa.com',
    cargo: 'Operador de Maquinaria',
    estado: 'ACTIVO',
    estado_acreditacion: 'APTO',
    foto: 'https://i.pravatar.cc/300?img=12',
    created_at: '2024-01-20T10:00:00'
  },
  {
    persona_id: 2,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_documento: 'DNI',
    numero_documento: '45678912',
    nombres: 'María Claudia',
    apellidos: 'López Silva',
    fecha_nacimiento: '1990-08-22',
    telefono: '976543210',
    email: 'mlopez@contratistakallpa.com',
    cargo: 'Supervisor de Seguridad',
    estado: 'ACTIVO',
    estado_acreditacion: 'APTO',
    foto: 'https://i.pravatar.cc/300?img=5',
    created_at: '2024-01-22T11:30:00'
  },
  {
    persona_id: 3,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_documento: 'DNI',
    numero_documento: '41234567',
    nombres: 'Carlos Alberto',
    apellidos: 'Rojas Mendoza',
    fecha_nacimiento: '1988-03-10',
    telefono: '965432109',
    email: 'crojas@contratistakallpa.com',
    cargo: 'Técnico Electricista',
    estado: 'ACTIVO',
    estado_acreditacion: 'OBSERVADO',
    foto: 'https://i.pravatar.cc/300?img=33',
    created_at: '2024-02-01T09:15:00'
  },
  {
    persona_id: 4,
    tenant_id: 'KALLPA',
    empresa_id: 1,
    tipo_documento: 'DNI',
    numero_documento: '48765432',
    nombres: 'Ana Patricia',
    apellidos: 'Torres Vargas',
    fecha_nacimiento: '1992-11-05',
    telefono: '954321098',
    email: 'atorres@contratistakallpa.com',
    cargo: 'Ingeniera de Campo',
    estado: 'ACTIVO',
    estado_acreditacion: 'PENDIENTE',
    foto: 'https://i.pravatar.cc/300?img=9',
    created_at: '2024-02-15T14:20:00'
  },
  
  // Empresa 2: Servicios Mineros del Sur
  {
    persona_id: 5,
    tenant_id: 'KALLPA',
    empresa_id: 2,
    tipo_documento: 'DNI',
    numero_documento: '42345678',
    nombres: 'Roberto',
    apellidos: 'Sánchez Díaz',
    fecha_nacimiento: '1987-07-18',
    telefono: '943210987',
    email: 'rsanchez@minerossur.com',
    cargo: 'Perforista',
    estado: 'ACTIVO',
    estado_acreditacion: 'APTO',
    foto: 'https://i.pravatar.cc/300?img=15',
    created_at: '2024-03-25T08:00:00'
  },
  {
    persona_id: 6,
    tenant_id: 'KALLPA',
    empresa_id: 2,
    tipo_documento: 'DNI',
    numero_documento: '46789123',
    nombres: 'Patricia',
    apellidos: 'Quispe Mamani',
    fecha_nacimiento: '1991-12-30',
    telefono: '932109876',
    email: 'pquispe@minerossur.com',
    cargo: 'Geóloga',
    estado: 'ACTIVO',
    estado_acreditacion: 'OBSERVADO',
    foto: 'https://i.pravatar.cc/300?img=20',
    created_at: '2024-03-28T10:30:00'
  },
  
  // Empresa 3: Construcciones Industriales SAA
  {
    persona_id: 7,
    tenant_id: 'KALLPA',
    empresa_id: 3,
    tipo_documento: 'DNI',
    numero_documento: '44567891',
    nombres: 'Luis Fernando',
    apellidos: 'Castillo Ramos',
    fecha_nacimiento: '1986-04-25',
    telefono: '921098765',
    email: 'lcastillo@construindustrial.com',
    cargo: 'Maestro de Obra',
    estado: 'ACTIVO',
    estado_acreditacion: 'PENDIENTE',
    foto: 'https://i.pravatar.cc/300?img=25',
    created_at: '2024-02-12T07:45:00'
  },
  {
    persona_id: 8,
    tenant_id: 'KALLPA',
    empresa_id: 3,
    tipo_documento: 'CE',
    numero_documento: '001234567',
    nombres: 'Miguel Ángel',
    apellidos: 'Fernández López',
    fecha_nacimiento: '1989-09-14',
    telefono: '910987654',
    email: 'mfernandez@construindustrial.com',
    cargo: 'Soldador Calificado',
    estado: 'ACTIVO',
    estado_acreditacion: 'APTO',
    foto: 'https://i.pravatar.cc/300?img=30',
    created_at: '2024-02-18T13:00:00'
  },
  
  // Empresa 4: Consultores Externos EIRL
  {
    persona_id: 9,
    tenant_id: 'KALLPA',
    empresa_id: 4,
    tipo_documento: 'DNI',
    numero_documento: '47891234',
    nombres: 'Sandra Lucia',
    apellidos: 'Morales Vega',
    fecha_nacimiento: '1993-02-28',
    telefono: '999876543',
    email: 'smorales@consultoresext.com',
    cargo: 'Consultora SSOMA',
    estado: 'ACTIVO',
    estado_acreditacion: 'APTO',
    foto: 'https://i.pravatar.cc/300?img=10',
    created_at: '2024-05-06T09:30:00'
  },
  {
    persona_id: 10,
    tenant_id: 'KALLPA',
    empresa_id: 4,
    tipo_documento: 'DNI',
    numero_documento: '49876543',
    nombres: 'Jorge Luis',
    apellidos: 'Campos Ortiz',
    fecha_nacimiento: '1984-06-12',
    telefono: '988765432',
    email: 'jcampos@consultoresext.com',
    cargo: 'Auditor Senior',
    estado: 'INACTIVO',
    estado_acreditacion: 'OBSERVADO',
    foto: 'https://i.pravatar.cc/300?img=35',
    created_at: '2024-05-08T11:00:00'
  }
];