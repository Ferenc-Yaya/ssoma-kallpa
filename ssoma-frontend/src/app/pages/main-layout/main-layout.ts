import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem } from '../../core/config/menu-config';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs';
import { NotificacionesComponent } from '../../shared/notificaciones/notificaciones';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    BreadcrumbsComponent,
    NotificacionesComponent
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  username: string = '';
  userRole: string = '';
  tenantId: string = '';
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'Usuario';
    this.userRole = this.authService.getRole() || '';
    this.tenantId = this.authService.getTenantId() || '';
    this.menuItems = this.menuService.getMenuItemsForCurrentUser();
    
    console.log('Usuario actual:', this.username);
    console.log('Rol:', this.userRole);
    console.log('Tenant:', this.tenantId);
    console.log('Menú disponible:', this.menuItems);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRolLabel(): string {
    switch (this.userRole) {
      case 'SUPER_ADMIN':
        return 'Super Administrador';
      case 'ADMIN_EMPRESA_PRINCIPAL':
        return 'Empresa Principal';
      case 'ADMIN_CONTRATISTA':
        return 'Contratista';
      default:
        return '';
    }
  }
}