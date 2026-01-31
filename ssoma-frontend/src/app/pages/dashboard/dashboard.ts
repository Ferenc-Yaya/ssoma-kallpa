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
  displayedColumnsProveedores: string[] = ['proveedor', 'servicioOC', 'empleados', 'activos', 'cumplimiento', 'estado'];

  // Filtros
  searchText: string = '';
  filterEstado: string = 'todos';

  // Datos filtrados
  proveedoresFiltrados = [...this.stats.proveedores];

  // Control de filas expandidas
  expandedElement: any | null = null;

  // Control de alertas
  mostrarDetalleAlertas: boolean = false;
  alertasFiltradas: any[] = [];

  ngOnInit(): void {
    this.aplicarFiltros();
  }

  ngAfterViewInit(): void {
    this.createSemaforoChart();
  }

  // Obtener total de alertas
  getTotalAlertas(): number {
    return this.stats.alertasVencimientos.hoy +
           this.stats.alertasVencimientos.tresDias +
           this.stats.alertasVencimientos.sieteDias +
           this.stats.alertasVencimientos.quinceDias +
           this.stats.problemas.observacionesSinRespuesta +
           this.stats.problemas.documentosSinRevisar;
  }

  // Filtrar alertas por tipo
  filtrarAlertas(tipo: string): void {
    this.mostrarDetalleAlertas = true;

    switch (tipo) {
      case 'hoy':
        this.alertasFiltradas = this.stats.detalleAlertas.filter(a =>
          a.tipo === 'vencimiento' && a.diasRestantes === 0
        );
        break;
      case '3dias':
        this.alertasFiltradas = this.stats.detalleAlertas.filter(a =>
          a.tipo === 'vencimiento' && a.diasRestantes !== undefined && a.diasRestantes > 0 && a.diasRestantes <= 3
        );
        break;
      case '7dias':
        this.alertasFiltradas = this.stats.detalleAlertas.filter(a =>
          a.tipo === 'vencimiento' && a.diasRestantes !== undefined && a.diasRestantes > 3 && a.diasRestantes <= 7
        );
        break;
      case '15dias':
        this.alertasFiltradas = this.stats.detalleAlertas.filter(a =>
          a.tipo === 'vencimiento' && a.diasRestantes !== undefined && a.diasRestantes > 7 && a.diasRestantes <= 15
        );
        break;
      default:
        this.alertasFiltradas = this.stats.detalleAlertas;
    }
  }

  // Cerrar detalle de alertas
  cerrarDetalleAlertas(): void {
    this.mostrarDetalleAlertas = false;
    this.alertasFiltradas = [];
  }

  // Ver detalle de problemas
  verDetalle(tipo: string): void {
    this.mostrarDetalleAlertas = true;

    switch (tipo) {
      case 'sinRevisar':
        this.alertasFiltradas = this.stats.detalleAlertas.filter(a => a.tipo === 'vencimiento');
        break;
      case 'sinRespuesta':
        this.alertasFiltradas = this.stats.detalleAlertas.filter(a => a.tipo === 'observacion');
        break;
      case 'altoIndice':
      case 'errores':
      case 'reiterativos':
        this.alertasFiltradas = this.stats.detalleAlertas.filter(a => a.tipo === 'incumplimiento');
        break;
      default:
        this.alertasFiltradas = this.stats.detalleAlertas;
    }
  }

  // Obtener label del tipo de alerta
  getTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'vencimiento': 'Vencimiento',
      'observacion': 'Observación',
      'incumplimiento': 'Incumplimiento'
    };
    return labels[tipo] || tipo;
  }

  toggleRow(element: any): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  createSemaforoChart(): void {
    const ctx = document.getElementById('semaforoChart') as HTMLCanvasElement;
    if (!ctx) return;

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
      const searchLower = this.searchText.toLowerCase();
      const matchSearch = !this.searchText ||
        p.proveedor.toLowerCase().includes(searchLower) ||
        p.ruc.toLowerCase().includes(searchLower) ||
        p.servicioOC.toLowerCase().includes(searchLower);

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
