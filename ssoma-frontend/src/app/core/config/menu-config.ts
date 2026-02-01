import { MatIcon } from '@angular/material/icon';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[]; // Roles que pueden ver esta opción
}

export const MENU_ITEMS: MenuItem[] = [
  // ===== SUPER ADMIN =====
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard-superadmin',
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Empresa Principal',
    icon: 'domain',
    route: '/empresa-principal',
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Todas las Empresas',
    icon: 'business',
    route: '/empresas',
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Usuarios',
    icon: 'group',
    route: '/usuarios',
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Roles',
    icon: 'admin_panel_settings',
    route: '/roles',
    roles: ['SUPER_ADMIN']
  },
  
  // ===== EMPRESA PRINCIPAL =====
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: ['ADMIN_EMPRESA_PRINCIPAL']
  },
  {
    label: 'Mis Contratistas',
    icon: 'business',
    route: '/empresas',
    roles: ['ADMIN_EMPRESA_PRINCIPAL']
  },
  {
    label: 'Contratos',
    icon: 'description',
    route: '/contratos',
    roles: ['ADMIN_EMPRESA_PRINCIPAL']
  },
  {
    label: 'Personal',
    icon: 'people',
    route: '/personal-kallpa',
    roles: ['ADMIN_EMPRESA_PRINCIPAL']
  },
  {
    label: 'Acreditación',
    icon: 'assignment_turned_in',
    route: '/acreditacion',
    roles: ['ADMIN_EMPRESA_PRINCIPAL']
  },
  {
    label: 'Pasaportes',
    icon: 'badge',
    route: '/pasaporte',
    roles: ['ADMIN_EMPRESA_PRINCIPAL']
  },
  {
    label: 'Reglas de Negocio',
    icon: 'rule',
    route: '/reglas-negocio',
    roles: ['ADMIN_EMPRESA_PRINCIPAL']
  },
  
  // ===== CONTRATISTA =====
  {
    label: 'Mi Dashboard',
    icon: 'dashboard',
    route: '/dashboard-contratista',
    roles: ['ADMIN_CONTRATISTA']
  },
  {
    label: 'Mi Empresa',
    icon: 'business',
    route: '/mi-empresa',
    roles: ['ADMIN_CONTRATISTA']
  },
  {
    label: 'Mis Contratos',
    icon: 'description',
    route: '/mis-contratos',
    roles: ['ADMIN_CONTRATISTA']
  },
  {
    label: 'Mis Pasaportes',
    icon: 'badge',
    route: '/mis-pasaportes',
    roles: ['ADMIN_CONTRATISTA']
  }
];
