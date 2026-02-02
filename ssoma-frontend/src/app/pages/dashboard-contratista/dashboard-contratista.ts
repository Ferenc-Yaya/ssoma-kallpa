import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { CONTRATOS_MOCK, ContratoMock, RecursoContrato } from '../../mocks/contratos.mock';

@Component({
  selector: 'app-dashboard-contratista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    RouterLink
  ],
  templateUrl: './dashboard-contratista.html',
  styleUrl: './dashboard-contratista.scss'
})
export class DashboardContratistaComponent implements OnInit {
  nombreEmpresa: string = 'Constructora Andina S.A.C.';

  constructor(private router: Router) {}

  // Filtros y paginación
  searchTerm: string = '';
  filtroEstado: string = 'todos';
  pageSize: number = 6;
  pageIndex: number = 0;

  // Lista de contratos del contratista (desde el mock centralizado)
  todosLosContratos: ContratoMock[] = CONTRATOS_MOCK;

  // Contratos filtrados para mostrar
  get contratosFiltrados(): ContratoMock[] {
    let resultado = this.todosLosContratos;

    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase();
      resultado = resultado.filter(c =>
        c.numero.toLowerCase().includes(termino) ||
        c.descripcion.toLowerCase().includes(termino) ||
        c.sede.toLowerCase().includes(termino)
      );
    }

    // Filtrar por estado
    if (this.filtroEstado === 'atencion') {
      // Filtrar solo los que requieren atención (tienen vencidos)
      resultado = resultado.filter(c =>
        c.estado !== 'nuevo' &&
        c.estado !== 'finalizado' &&
        c.recursos.some(r => r.vencidos > 0)
      );
    } else if (this.filtroEstado !== 'todos') {
      resultado = resultado.filter(c => c.estado === this.filtroEstado);
    }

    return resultado;
  }

  // Contratos paginados
  get contratosPaginados(): ContratoMock[] {
    const inicio = this.pageIndex * this.pageSize;
    return this.contratosFiltrados.slice(inicio, inicio + this.pageSize);
  }

  // Resumen de estados
  get resumenEstados() {
    return {
      nuevos: this.todosLosContratos.filter(c => c.estado === 'nuevo').length,
      requierenAtencion: this.contratosConAlertas.length,
      habilitados: this.todosLosContratos.filter(c => c.estado === 'habilitado').length,
      parciales: this.todosLosContratos.filter(c => c.estado === 'parcial').length,
      finalizados: this.todosLosContratos.filter(c => c.estado === 'finalizado').length,
      total: this.todosLosContratos.length
    };
  }

  // Contratos que requieren atención (tienen documentos vencidos o por vencer pronto)
  get contratosConAlertas(): ContratoMock[] {
    return this.todosLosContratos.filter(c =>
      c.estado !== 'nuevo' &&
      c.estado !== 'finalizado' &&
      c.recursos.some(r => r.vencidos > 0)
    );
  }

  ngOnInit(): void {
    // TODO: Cargar contratos del servicio
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onSearchChange(): void {
    this.pageIndex = 0; // Resetear a primera página al buscar
  }

  onFiltroChange(): void {
    this.pageIndex = 0; // Resetear a primera página al filtrar
  }

  getSemaforoColor(contrato: ContratoMock): string {
    if (contrato.estado === 'nuevo') return 'azul';
    if (contrato.estado === 'finalizado') return 'gris';
    if (contrato.porcentajeCumplimiento >= 90) return 'verde';
    if (contrato.porcentajeCumplimiento >= 70) return 'amarillo';
    return 'rojo';
  }

  getEstadoClass(estado: string): string {
    return estado;
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'nuevo': return 'NUEVO';
      case 'habilitado': return 'HABILITADO';
      case 'parcial': return 'PARCIAL';
      case 'finalizado': return 'FINALIZADO';
      default: return estado.toUpperCase();
    }
  }

  // Total de vencidos en el contrato
  getTotalVencidos(contrato: ContratoMock): number {
    return contrato.recursos.reduce((sum, r) => sum + r.vencidos, 0);
  }

  // Total por vencer en el contrato
  getTotalPorVencer(contrato: ContratoMock): number {
    return contrato.recursos.reduce((sum, r) => sum + r.porVencer, 0);
  }

  getPorcentajeRecurso(recurso: RecursoContrato): number {
    if (recurso.total === 0) return 0;
    return Math.round((recurso.habilitados / recurso.total) * 100);
  }

  // Calcula el porcentaje de cumplimiento basado en recursos
  // En producción esto vendría calculado del backend
  calcularPorcentajeCumplimiento(contrato: ContratoMock): number {
    if (contrato.estado === 'nuevo') return 0;

    const totalHabilitados = contrato.recursos.reduce((sum, r) => sum + r.habilitados, 0);
    const totalRecursos = contrato.recursos.reduce((sum, r) => sum + r.total, 0);

    if (totalRecursos === 0) return 0;
    return Math.round((totalHabilitados / totalRecursos) * 100);
  }

  gestionarContrato(contrato: ContratoMock): void {
    this.router.navigate(['/mis-contratos', contrato.id]);
  }

  verPasaporte(contrato: ContratoMock): void {
    // Solo permitir para contratos habilitados o finalizados
    if (contrato.estado === 'habilitado' || contrato.estado === 'finalizado') {
      this.router.navigate(['/pasaporte', contrato.id]);
    }
  }
}
