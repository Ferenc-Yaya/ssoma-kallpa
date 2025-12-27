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
    label: 'Dashboard General',
    icon: 'dashboard',
    route: '/dashboard',
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Todas las Empresas',
    icon: 'business',
    route: '/empresas',
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Acreditación Global',
    icon: 'assignment_turned_in',
    route: '/acreditacion',
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Pasaportes',
    icon: 'badge',
    route: '/pasaporte',
    roles: ['SUPER_ADMIN']
  },
  {
    label: 'Reglas de Negocio',
    icon: 'rule',
    route: '/reglas-negocio',
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
    route: '/dashboard',
    roles: ['ADMIN_CONTRATISTA']
  },
  {
    label: 'Mi Empresa',
    icon: 'business',
    route: '/mi-empresa',
    roles: ['ADMIN_CONTRATISTA']
  },
  {
    label: 'Mi Personal',
    icon: 'people',
    route: '/mi-personal',
    roles: ['ADMIN_CONTRATISTA']
  },
  {
    label: 'Mis Documentos',
    icon: 'description',
    route: '/mis-documentos',
    roles: ['ADMIN_CONTRATISTA']
  },
  {
    label: 'Pasaportes',
    icon: 'badge',
    route: '/pasaporte',
    roles: ['ADMIN_CONTRATISTA']
  }
];
