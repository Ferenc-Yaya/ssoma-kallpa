import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
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
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: DashboardStats = DASHBOARD_MOCK;
  chart: any;

  // Columnas para tabla de observaciones
  displayedColumnsObservaciones: string[] = ['posicion', 'empresa', 'documentosVencidos', 'documentosFaltantes', 'semaforo'];

  // Columnas para tabla de proveedores
  displayedColumnsProveedores: string[] = ['proveedor', 'empleados', 'activos', 'materialesPeligrosos', 'contratos', 'acreditacion'];

  // Filtros
  searchText: string = '';
  filterEstado: string = 'todos';

  // Datos filtrados
  proveedoresFiltrados = [...this.stats.proveedores];

  // Control de filas expandidas
  expandedElement: any | null = null;

  ngOnInit(): void {
    this.aplicarFiltros();
  }

  toggleRow(element: any): void {
    this.expandedElement = this.expandedElement === element ? null : element;
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

  aplicarFiltros(): void {
    this.proveedoresFiltrados = this.stats.proveedores.filter(p => {
      const matchSearch = !this.searchText ||
        p.proveedor.toLowerCase().includes(this.searchText.toLowerCase());

      const matchEstado = this.filterEstado === 'todos' ||
        p.estado === this.filterEstado;

      return matchSearch && matchEstado;
    });
  }

  limpiarFiltros(): void {
    this.searchText = '';
    this.filterEstado = 'todos';
    this.aplicarFiltros();
  }
}