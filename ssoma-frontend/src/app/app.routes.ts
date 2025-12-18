import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayoutComponent } from './pages/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EmpresasComponent } from './pages/empresas/empresas';
import { EmpresaDetalleComponent } from './pages/empresa-detalle/empresa-detalle';
import { EmpresaPersonalComponent } from './pages/empresa-personal/empresa-personal';
import { PasaporteComponent } from './pages/pasaporte/pasaporte';
import { EmpresaActivosComponent } from './pages/empresa-activos/empresa-activos';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'empresas', component: EmpresasComponent },
      { path: 'empresas/:id', component: EmpresaDetalleComponent },
      { path: 'empresas/:id/personal', component: EmpresaPersonalComponent },
      { path: 'pasaporte', component: PasaporteComponent },
      { path: 'pasaporte/:id', component: PasaporteComponent },
      { path: 'empresas/:id/activos', component: EmpresaActivosComponent},
      
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