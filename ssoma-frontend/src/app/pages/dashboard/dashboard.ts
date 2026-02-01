import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CONTRATISTAS_MOCK, ContratistaMock, ContratoContratista } from '../../mocks/contratistas.mock';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  // Filtros y paginación
  searchTerm: string = '';
  filtroEstado: string = 'todos';
  pageSize: number = 10;
  pageIndex: number = 0;

  // Datos
  todosLosContratistas: ContratistaMock[] = CONTRATISTAS_MOCK;

  // Columnas de la tabla
  displayedColumns: string[] = ['razonSocial', 'ruc', 'tipo', 'contratos', 'vencidos', 'porVencer', 'cumplimiento', 'acciones'];

  // Fila expandida
  expandedElement: ContratistaMock | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  // Contratistas filtrados
  get contratistasFiltrados(): ContratistaMock[] {
    let resultado = this.todosLosContratistas;

    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase();
      resultado = resultado.filter(c =>
        c.razonSocial.toLowerCase().includes(termino) ||
        c.ruc.toLowerCase().includes(termino) ||
        c.tipoContratista.toLowerCase().includes(termino)
      );
    }

    if (this.filtroEstado === 'atencion') {
      resultado = resultado.filter(c => c.resumen.documentosVencidos > 0);
    } else if (this.filtroEstado !== 'todos') {
      resultado = resultado.filter(c => c.estado === this.filtroEstado);
    }

    return resultado;
  }

  // Contratistas paginados
  get contratistasPaginados(): ContratistaMock[] {
    const inicio = this.pageIndex * this.pageSize;
    return this.contratistasFiltrados.slice(inicio, inicio + this.pageSize);
  }

  // Resumen de estados
  get resumenEstados() {
    return {
      nuevos: this.todosLosContratistas.filter(c => c.estado === 'nuevo').length,
      requierenAtencion: this.todosLosContratistas.filter(c => c.resumen.documentosVencidos > 0).length,
      habilitados: this.todosLosContratistas.filter(c => c.estado === 'habilitado').length,
      parciales: this.todosLosContratistas.filter(c => c.estado === 'parcial').length,
      bloqueados: this.todosLosContratistas.filter(c => c.estado === 'bloqueado').length,
      total: this.todosLosContratistas.length
    };
  }

  // Totales globales
  get totalContratistas(): number {
    return this.todosLosContratistas.length;
  }

  get totalContratos(): number {
    return this.todosLosContratistas.reduce((sum, c) => sum + c.contratos.length, 0);
  }

  get totalDocumentosVencidos(): number {
    return this.todosLosContratistas.reduce((sum, c) => sum + c.resumen.documentosVencidos, 0);
  }

  get totalDocumentosPorVencer(): number {
    return this.todosLosContratistas.reduce((sum, c) => sum + c.resumen.documentosPorVencer, 0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onSearchChange(): void {
    this.pageIndex = 0;
  }

  onFiltroChange(): void {
    this.pageIndex = 0;
  }

  toggleRow(contratista: ContratistaMock): void {
    this.expandedElement = this.expandedElement === contratista ? null : contratista;
  }

  getSemaforoColor(contratista: ContratistaMock): string {
    if (contratista.estado === 'nuevo') return 'azul';
    if (contratista.estado === 'bloqueado') return 'rojo';
    if (contratista.porcentajeCumplimiento >= 90) return 'verde';
    if (contratista.porcentajeCumplimiento >= 70) return 'amarillo';
    return 'rojo';
  }

  getContratoSemaforoColor(contrato: ContratoContratista): string {
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
    const labels: { [key: string]: string } = {
      'nuevo': 'NUEVO',
      'habilitado': 'HABILITADO',
      'parcial': 'PARCIAL',
      'bloqueado': 'BLOQUEADO',
      'finalizado': 'FINALIZADO'
    };
    return labels[estado] || estado.toUpperCase();
  }

  getCumplimientoClass(porcentaje: number): string {
    if (porcentaje >= 90) return 'verde';
    if (porcentaje >= 70) return 'amarillo';
    return 'rojo';
  }

  verDetalleContratista(contratista: ContratistaMock): void {
    this.router.navigate(['/empresas', contratista.id]);
  }
}
