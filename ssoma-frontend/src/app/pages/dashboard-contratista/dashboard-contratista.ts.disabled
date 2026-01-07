import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DASHBOARD_CONTRATISTA_MOCK, DashboardContratistaStats } from '../../mocks/dashboard-contratista.mock';

@Component({
  selector: 'app-dashboard-contratista',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard-contratista.html',
  styleUrl: './dashboard-contratista.scss'
})
export class DashboardContratistaComponent implements OnInit {
  stats: DashboardContratistaStats = DASHBOARD_CONTRATISTA_MOCK;

  displayedColumns: string[] = ['contrato', 'descripcion', 'fechas', 'personal', 'activos', 'materiales', 'estado', 'progreso'];

  ngOnInit(): void {
    // Component initialization
  }

  getProgresoColor(progreso: number): string {
    if (progreso >= 90) return 'success';
    if (progreso >= 70) return 'primary';
    if (progreso >= 50) return 'accent';
    return 'warn';
  }
}
