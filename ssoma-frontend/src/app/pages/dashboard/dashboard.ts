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
import { CONTRATISTAS_MOCK, ContratistaMock, ContratoContratista, DocumentoAlerta } from '../../mocks/contratistas.mock';

interface DocumentoDetalle extends DocumentoAlerta {
  contratista: string;
  contratoNumero: string;
  contratoId: string;
}

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
  displayedColumns: string[] = ['razonSocial', 'ruc', 'tipo', 'contratos', 'aprobados', 'enRevision', 'observados', 'vencidos', 'porVencer', 'cumplimiento', 'acciones'];

  // Fila expandida
  expandedElement: ContratistaMock | null = null;

  // Vista de documentos
  vistaDocumentos: boolean = false;
  panelTitulo: string = '';
  panelTipo: string = '';
  documentosFiltrados: DocumentoDetalle[] = [];
  columnasDocumentos: string[] = ['tipo', 'documento', 'entidad', 'contratista', 'contrato', 'estado', 'vencimiento'];
  pageSizeDocumentos: number = 10;
  pageIndexDocumentos: number = 0;

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

  get totalDocumentosAprobados(): number {
    return this.todosLosContratistas.reduce((sum, c) => sum + c.resumen.documentosAprobados, 0);
  }

  get totalDocumentosEnRevision(): number {
    return this.todosLosContratistas.reduce((sum, c) => sum + c.resumen.documentosEnRevision, 0);
  }

  get totalDocumentosObservados(): number {
    return this.todosLosContratistas.reduce((sum, c) => sum + c.resumen.documentosObservados, 0);
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

  // Obtener todos los documentos de todos los contratistas
  getTodosLosDocumentos(): DocumentoDetalle[] {
    const documentos: DocumentoDetalle[] = [];

    this.todosLosContratistas.forEach(contratista => {
      contratista.contratos.forEach(contrato => {
        if (contrato.documentos) {
          contrato.documentos.forEach(doc => {
            documentos.push({
              ...doc,
              contratista: contratista.razonSocial,
              contratoNumero: contrato.numero,
              contratoId: contrato.id
            });
          });
        }
      });
    });

    return documentos;
  }

  // Documentos paginados
  get documentosPaginados(): DocumentoDetalle[] {
    const inicio = this.pageIndexDocumentos * this.pageSizeDocumentos;
    return this.documentosFiltrados.slice(inicio, inicio + this.pageSizeDocumentos);
  }

  // Abrir vista de documentos filtrados por estado
  abrirPanelDocumentos(tipo: string): void {
    const todosDocumentos = this.getTodosLosDocumentos();

    switch (tipo) {
      case 'aprobados':
        this.panelTitulo = 'Documentos Aprobados';
        this.documentosFiltrados = todosDocumentos.filter(d => d.estado === 'aprobado');
        break;
      case 'en_revision':
        this.panelTitulo = 'Documentos En Revisión';
        this.documentosFiltrados = todosDocumentos.filter(d => d.estado === 'en_revision');
        break;
      case 'observados':
        this.panelTitulo = 'Documentos Observados';
        this.documentosFiltrados = todosDocumentos.filter(d => d.estado === 'observado');
        break;
      case 'vencidos':
        this.panelTitulo = 'Documentos Vencidos';
        this.documentosFiltrados = todosDocumentos.filter(d => d.estado === 'vencido');
        break;
      case 'por_vencer':
        this.panelTitulo = 'Documentos Por Vencer';
        this.documentosFiltrados = todosDocumentos.filter(d => d.estado === 'por_vencer');
        break;
      default:
        this.panelTitulo = 'Documentos';
        this.documentosFiltrados = todosDocumentos;
    }

    this.panelTipo = tipo;
    this.pageIndexDocumentos = 0;
    this.vistaDocumentos = true;
  }

  cerrarVistaDocumentos(): void {
    this.vistaDocumentos = false;
    this.documentosFiltrados = [];
  }

  onPageChangeDocumentos(event: PageEvent): void {
    this.pageIndexDocumentos = event.pageIndex;
    this.pageSizeDocumentos = event.pageSize;
  }

  getEstadoDocumentoClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'aprobado': 'estado-aprobado',
      'en_revision': 'estado-en-revision',
      'observado': 'estado-observado',
      'vencido': 'estado-vencido',
      'por_vencer': 'estado-por-vencer'
    };
    return clases[estado] || '';
  }

  getEstadoDocumentoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'aprobado': 'Aprobado',
      'en_revision': 'En Revisión',
      'observado': 'Observado',
      'vencido': 'Vencido',
      'por_vencer': 'Por Vencer'
    };
    return labels[estado] || estado;
  }

  getTipoDocumentoIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'empresa': 'business',
      'personal': 'person',
      'vehiculo': 'directions_car',
      'equipo': 'build'
    };
    return iconos[tipo] || 'description';
  }
}
