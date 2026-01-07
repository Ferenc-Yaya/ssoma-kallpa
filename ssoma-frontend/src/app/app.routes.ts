import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayoutComponent } from './pages/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DashboardContratistaComponent } from './pages/dashboard-contratista/dashboard-contratista';
import { DashboardSuperadminComponent } from './pages/dashboard-superadmin/dashboard-superadmin';
import { EmpresasComponent } from './pages/empresas/empresas';
import { EmpresaDetalleComponent } from './pages/empresa-detalle/empresa-detalle';
import { EmpresaPersonalComponent } from './pages/empresa-personal/empresa-personal';
import { PasaporteComponent } from './pages/pasaporte/pasaporte';
import { EmpresaActivosComponent } from './pages/empresa-activos/empresa-activos';
import { ContratosComponent } from './pages/contratos/contratos';
import { PersonalKallpaComponent } from './pages/personal-kallpa/personal-kallpa';
import { ReglasNegocioComponent } from './pages/reglas-negocio/reglas-negocio';
import { PersonalDocumentosComponent } from './pages/personal-documentos/personal-documentos';
import { ActivoDocumentosComponent } from './pages/activo-documentos/activo-documentos';
import { EmpresaMaterialesPeligrososComponent } from './pages/empresa-materiales-peligrosos/empresa-materiales-peligrosos';
import { MaterialPeligrosoDocumentosComponent } from './pages/material-peligroso-documentos/material-peligroso-documentos';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard-contratista', component: DashboardContratistaComponent },
      { path: 'dashboard-superadmin', component: DashboardSuperadminComponent },
      {
        path: 'empresa-principal',
        loadComponent: () => import('./pages/empresa-principal/empresa-principal').then(m => m.EmpresaPrincipalComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.UsuariosComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./pages/roles/roles').then(m => m.RolesComponent)
      },
      {
        path: 'empresa-usuarios',
        loadComponent: () => import('./pages/empresa-usuarios/empresa-usuarios').then(m => m.EmpresaUsuariosComponent)
      },
      { path: 'empresas', component: EmpresasComponent },
      { path: 'empresas/:id', component: EmpresaDetalleComponent },
      { path: 'empresas/:id/personal', component: EmpresaPersonalComponent },
      { path: 'empresas/:id/personal/:personaId/documentos', component: PersonalDocumentosComponent },
      { path: 'pasaporte', component: PasaporteComponent },
      { path: 'pasaporte/:id', component: PasaporteComponent },
      { path: 'empresas/:id/activos', component: EmpresaActivosComponent},
      { path: 'empresas/:id/activos/:activoId/documentos', component: ActivoDocumentosComponent },
      { path: 'empresas/:id/materiales-peligrosos', component: EmpresaMaterialesPeligrososComponent },
      { path: 'empresas/:id/materiales-peligrosos/:materialId/documentos', component: MaterialPeligrosoDocumentosComponent },
      { path: 'contratos', component: ContratosComponent },
      { path: 'personal-kallpa', component: PersonalKallpaComponent },
      { path: 'reglas-negocio', component: ReglasNegocioComponent },

      // Rutas de acreditación
      {
        path: 'acreditacion',
        loadComponent: () => import('./pages/acreditacion-lista/acreditacion-lista').then(m => m.AcreditacionListaComponent)
      },
      {
        path: 'acreditacion/contrato/:id',
        loadComponent: () => import('./pages/acreditacion/acreditacion').then(m => m.AcreditacionComponent)
      }
    ]
  }
];
