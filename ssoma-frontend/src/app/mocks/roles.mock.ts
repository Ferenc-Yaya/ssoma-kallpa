export interface Rol {
  rol_id: number;
  tenant_id: string;
  nombre_rol: string;
  descripcion: string;
  permisos: {
    [key: string]: boolean;
  };
}

export const ROLES_MOCK: Rol[] = [
  {
    rol_id: 1,
    tenant_id: 'SYSTEM',
    nombre_rol: 'SUPER_ADMIN',
    descripcion: 'Administrador del sistema SSOMA',
    permisos: {
      all: true
    }
  },
  {
    rol_id: 2,
    tenant_id: 'KALLPA',
    nombre_rol: 'ADMIN_EMPRESA_PRINCIPAL',
    descripcion: 'Administrador de empresa principal',
    permisos: {
      ver_contratistas: true,
      revisar_documentos: true,
      aprobar_rechazar: true,
      gestionar_contratos: true
    }
  },
  {
    rol_id: 3,
    tenant_id: 'KALLPA',
    nombre_rol: 'ADMIN_CONTRATISTA',
    descripcion: 'Administrador de empresa contratista',
    permisos: {
      ver_su_empresa: true,
      cargar_documentos: true,
      gestionar_personal: true,
      ver_su_dashboard: true
    }
  }
];