import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { DASHBOARD_MOCK, DashboardStats } from '../../mocks/dashboard.mock';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: DashboardStats = DASHBOARD_MOCK;
  chart: any;
  displayedColumns: string[] = ['posicion', 'empresa', 'documentosRechazados', 'estado'];

  ngOnInit(): void {
    // Los datos ya están cargados desde el mock
  }

  ngAfterViewInit(): void {
    this.createSemaforoChart();
  }

  createSemaforoChart(): void {
    const ctx = document.getElementById('semaforoChart') as HTMLCanvasElement;
    
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Apto', 'Pendiente', 'Bloqueado'],
        datasets: [{
          data: [
            this.stats.semaforo.apto,
            this.stats.semaforo.pendiente,
            this.stats.semaforo.bloqueado
          ],
          backgroundColor: [
            '#22c55e',
            '#eab308',
            '#ef4444'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}