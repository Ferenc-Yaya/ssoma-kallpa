import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ContratoDialogComponent } from './contrato-dialog/contrato-dialog';
import { CONTRATOS_MOCK, Contrato } from '../../mocks/contratos.mock';
import { EMPRESAS_MOCK } from '../../mocks/empresas.mock';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './contratos.html',
  styleUrl: './contratos.scss'
})
export class ContratosComponent implements OnInit {
  contratos: Contrato[] = [];
  contratosFiltrados: Contrato[] = [];

  displayedColumns: string[] = ['numeroContrato', 'descripcion', 'empresa', 'fechaInicio', 'fechaFin', 'estado', 'acciones'];

  // Filtros
  searchText: string = '';
  filterEstado: string = 'todos';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.contratos = CONTRATOS_MOCK;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.contratosFiltrados = this.contratos.filter(c => {
      const matchSearch = !this.searchText ||
        c.numero_contrato.toLowerCase().includes(this.searchText.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(this.searchText.toLowerCase());

      const matchEstado = this.filterEstado === 'todos' ||
        c.estado === this.filterEstado;

      return matchSearch && matchEstado;
    });
  }

  limpiarFiltros(): void {
    this.searchText = '';
    this.filterEstado = 'todos';
    this.aplicarFiltros();
  }

  crearContrato(): void {
    const dialogRef = this.dialog.open(ContratoDialogComponent, {
      width: '550px',
      data: { contrato: null, mode: 'crear' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contratos.push(result);
        this.aplicarFiltros();
      }
    });
  }

  editarContrato(contrato: Contrato): void {
    const dialogRef = this.dialog.open(ContratoDialogComponent, {
      width: '550px',
      data: { contrato: { ...contrato }, mode: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.contratos.findIndex(c => c.contrato_id === result.contrato_id);
        if (index !== -1) {
          this.contratos[index] = result;
          this.aplicarFiltros();
        }
      }
    });
  }

  eliminarContrato(contrato: Contrato): void {
    if (confirm(`¿Estás seguro de eliminar el contrato ${contrato.numero_contrato}?`)) {
      const index = this.contratos.findIndex(c => c.contrato_id === contrato.contrato_id);
      if (index !== -1) {
        this.contratos.splice(index, 1);
        this.aplicarFiltros();
      }
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'VIGENTE': return 'estado-activa';
      case 'VENCIDO': return 'estado-porvencer';
      case 'SUSPENDIDO': return 'estado-finalizada';
      default: return '';
    }
  }
}
