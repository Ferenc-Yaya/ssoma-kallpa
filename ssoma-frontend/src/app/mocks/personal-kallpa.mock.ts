export interface GrupoKallpa {
  grupo_id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
  created_at: string;
}

export interface UsuarioKallpa {
  usuario_id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  cargo: string;
  area: string;
  grupo_id: number;
  grupo_nombre: string;
  estado: 'ACTIVO' | 'INACTIVO';
  foto_url: string;
  created_at: string;
}

export const GRUPOS_KALLPA_MOCK: GrupoKallpa[] = [
  {
    grupo_id: 1,
    nombre: 'Administradores de Contrato',
    descripcion: 'Administración de contratos y proveedores',
    permisos: ['crear', 'editar', 'eliminar', 'aprobar', 'reportes'],
    created_at: '2024-01-01T08:00:00'
  },
  {
    grupo_id: 2,
    nombre: 'Supervisores EHS',
    descripcion: 'Supervisión de seguridad, salud ocupacional y medio ambiente',
    permisos: ['crear', 'editar', 'aprobar', 'reportes'],
    created_at: '2024-01-01T08:00:00'
  },
  {
    grupo_id: 3,
    nombre: 'Auditores',
    descripcion: 'Auditoría y verificación de cumplimiento',
    permisos: ['crear', 'editar', 'reportes'],
    created_at: '2024-01-01T08:00:00'
  }
];

export const USUARIOS_KALLPA_MOCK: UsuarioKallpa[] = [
  {
    usuario_id: 1,
    nombres: 'Carlos Alberto',
    apellidos: 'Mendoza Silva',
    dni: '45678912',
    email: 'cmendoza@kallpa.com',
    telefono: '987654321',
    cargo: 'Administrador de Contratos',
    area: 'Gestión de Contratos',
    grupo_id: 1,
    grupo_nombre: 'Administradores de Contrato',
    estado: 'ACTIVO',
    foto_url: '',
    created_at: '2024-01-15T09:00:00'
  },
  {
    usuario_id: 2,
    nombres: 'María Claudia',
    apellidos: 'Torres Rojas',
    dni: '46789123',
    email: 'mtorres@kallpa.com',
    telefono: '987654322',
    cargo: 'Supervisor EHS',
    area: 'Seguridad y Salud Ocupacional',
    grupo_id: 2,
    grupo_nombre: 'Supervisores EHS',
    estado: 'ACTIVO',
    foto_url: '',
    created_at: '2024-02-01T10:00:00'
  },
  {
    usuario_id: 3,
    nombres: 'Roberto Javier',
    apellidos: 'Silva Paredes',
    dni: '47891234',
    email: 'rsilva@kallpa.com',
    telefono: '987654323',
    cargo: 'Coordinador de Contratos',
    area: 'Gestión de Contratos',
    grupo_id: 1,
    grupo_nombre: 'Administradores de Contrato',
    estado: 'ACTIVO',
    foto_url: '',
    created_at: '2024-02-15T11:00:00'
  },
  {
    usuario_id: 4,
    nombres: 'Ana Patricia',
    apellidos: 'Martínez López',
    dni: '48912345',
    email: 'amartinez@kallpa.com',
    telefono: '987654324',
    cargo: 'Auditor EHS',
    area: 'Auditoría',
    grupo_id: 3,
    grupo_nombre: 'Auditores',
    estado: 'ACTIVO',
    foto_url: '',
    created_at: '2024-03-01T09:30:00'
  },
  {
    usuario_id: 5,
    nombres: 'Jorge Luis',
    apellidos: 'Fernández Quispe',
    dni: '49123456',
    email: 'jfernandez@kallpa.com',
    telefono: '987654325',
    cargo: 'Supervisor EHS',
    area: 'Medio Ambiente',
    grupo_id: 2,
    grupo_nombre: 'Supervisores EHS',
    estado: 'ACTIVO',
    foto_url: '',
    created_at: '2024-03-15T14:00:00'
  },
  {
    usuario_id: 6,
    nombres: 'Elena Rosa',
    apellidos: 'Vargas Huamán',
    dni: '50234567',
    email: 'evargas@kallpa.com',
    telefono: '987654326',
    cargo: 'Auditor de Procesos',
    area: 'Auditoría',
    grupo_id: 3,
    grupo_nombre: 'Auditores',
    estado: 'INACTIVO',
    foto_url: '',
    created_at: '2024-04-01T08:00:00'
  }
];
