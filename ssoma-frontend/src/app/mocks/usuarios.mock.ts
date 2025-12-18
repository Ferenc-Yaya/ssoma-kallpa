export interface Usuario {
  usuario_id: number;
  tenant_id: string;
  username: string;
  password: string; // En producción sería password_hash
  email: string;
  rol_id: number;
  rol_nombre: string;
  persona_id: number | null;
  empresa_id: number | null;
  nombre_completo: string;
  activo: boolean;
}

export const USUARIOS_MOCK: Usuario[] = [
  {
    usuario_id: 1,
    tenant_id: 'SYSTEM',
    username: 'superadmin',
    password: 'admin123',
    email: 'admin@ssoma.com',
    rol_id: 1,
    rol_nombre: 'SUPER_ADMIN',
    persona_id: null,
    empresa_id: null,
    nombre_completo: 'Super Administrador SSOMA',
    activo: true
  },
  {
    usuario_id: 2,
    tenant_id: 'KALLPA',
    username: 'admin.kallpa',
    password: 'kallpa123',
    email: 'admin@kallpa.com',
    rol_id: 2,
    rol_nombre: 'ADMIN_EMPRESA_PRINCIPAL',
    persona_id: null,
    empresa_id: null,
    nombre_completo: 'Administrador KALLPA SAC',
    activo: true
  },
  {
    usuario_id: 3,
    tenant_id: 'KALLPA',
    username: 'jperez',
    password: 'contratista123',
    email: 'jperez@contratista.com',
    rol_id: 3,
    rol_nombre: 'ADMIN_CONTRATISTA',
    persona_id: 1,
    empresa_id: 1, // Contratista KALLPA SAC
    nombre_completo: 'Juan Pérez García',
    activo: true
  },
  {
    usuario_id: 4,
    tenant_id: 'KALLPA',
    username: 'mlopez',
    password: 'contratista123',
    email: 'mlopez@servicios.com',
    rol_id: 3,
    rol_nombre: 'ADMIN_CONTRATISTA',
    persona_id: 2,
    empresa_id: 2, // Servicios Mineros del Sur
    nombre_completo: 'María López Silva',
    activo: true
  }
];