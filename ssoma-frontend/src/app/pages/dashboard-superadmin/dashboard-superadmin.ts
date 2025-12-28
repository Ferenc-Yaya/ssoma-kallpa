import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

interface SystemStats {
  totalTenants: number;
  totalUsuarios: number;
  totalEmpresas: number;
  usuariosActivos: number;
}

@Component({
  selector: 'app-dashboard-superadmin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './dashboard-superadmin.html',
  styleUrl: './dashboard-superadmin.scss'
})
export class DashboardSuperadminComponent implements OnInit {
  stats: SystemStats = {
    totalTenants: 2,
    totalUsuarios: 145,
    totalEmpresas: 46,
    usuariosActivos: 128
  };

  recentActivity = [
    {
      icon: 'business',
      title: 'Nueva empresa registrada',
      description: 'CONSTRUCTORA DEL SUR SAC',
      time: 'Hace 2 horas',
      type: 'success'
    },
    {
      icon: 'person_add',
      title: 'Nuevo usuario creado',
      description: 'admin@kallpa.com',
      time: 'Hace 4 horas',
      type: 'info'
    },
    {
      icon: 'rule',
      title: 'Regla de negocio actualizada',
      description: 'Validación de documentos vencidos',
      time: 'Ayer',
      type: 'warning'
    }
  ];

  ngOnInit(): void {
    // Component initialization
    // TODO: Replace mock data with real API calls
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'success': return 'success-activity';
      case 'info': return 'info-activity';
      case 'warning': return 'warning-activity';
      default: return '';
    }
  }
}
