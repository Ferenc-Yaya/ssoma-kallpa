import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayoutComponent } from './pages/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EmpresasComponent } from './pages/empresas/empresas';
import { EmpresaDetalleComponent } from './pages/empresa-detalle/empresa-detalle';
import { AcreditacionComponent } from './pages/acreditacion/acreditacion';
import { PasaporteComponent } from './pages/pasaporte/pasaporte';

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
      { path: 'acreditacion', component: AcreditacionComponent },
      { path: 'pasaporte', component: PasaporteComponent },
      { path: 'pasaporte/:id', component: PasaporteComponent }
    ]
  }
];