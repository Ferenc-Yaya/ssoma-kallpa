import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CONTRATOS_MOCK, ContratoMock } from '../../mocks/contratos.mock';

@Component({
  selector: 'app-mis-contratos-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './mis-contratos-lista.html',
  styleUrl: './mis-contratos-lista.scss'
})
export class MisContratosListaComponent implements OnInit {
  searchTerm: string = '';

  displayedColumns: string[] = ['numero', 'descripcion', 'sede', 'vigencia', 'estado', 'cumplimiento', 'acciones'];

  // Lista de contratos (desde el mock centralizado)
  contratos: ContratoMock[] = CONTRATOS_MOCK;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {}

  get contratosFiltrados(): ContratoMock[] {
    if (!this.searchTerm.trim()) {
      return this.contratos;
    }
    const termino = this.searchTerm.toLowerCase();
    return this.contratos.filter(c =>
      c.numero.toLowerCase().includes(termino) ||
      c.descripcion.toLowerCase().includes(termino) ||
      c.sede.toLowerCase().includes(termino)
    );
  }

  onSearchChange(): void {
    // El getter contratosFiltrados se actualiza automáticamente
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
  }

  goBack(): void {
    this.location.back();
  }

  verDetalle(contrato: ContratoMock): void {
    this.router.navigate(['/mis-contratos', contrato.id]);
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'nuevo': 'NUEVO',
      'habilitado': 'HABILITADO',
      'parcial': 'PARCIAL',
      'finalizado': 'FINALIZADO'
    };
    return labels[estado] || estado.toUpperCase();
  }

  getEstadoChipClass(estado: string): string {
    return `chip-${estado}`;
  }

  getPorcentajeClass(porcentaje: number): string {
    if (porcentaje >= 90) return 'porcentaje-verde';
    if (porcentaje >= 70) return 'porcentaje-amarillo';
    return 'porcentaje-rojo';
  }
}
