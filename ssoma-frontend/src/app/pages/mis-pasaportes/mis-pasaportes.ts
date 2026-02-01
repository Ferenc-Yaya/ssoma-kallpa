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
  selector: 'app-mis-pasaportes',
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
  templateUrl: './mis-pasaportes.html',
  styleUrl: './mis-pasaportes.scss'
})
export class MisPasaportesComponent implements OnInit {
  searchTerm: string = '';

  displayedColumns: string[] = ['numero', 'descripcion', 'sede', 'vigencia', 'estado', 'acciones'];

  // Solo contratos habilitados o finalizados tienen pasaporte
  get pasaportes(): ContratoMock[] {
    return CONTRATOS_MOCK.filter(c => c.estado === 'habilitado' || c.estado === 'finalizado');
  }

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {}

  get pasaportesFiltrados(): ContratoMock[] {
    if (!this.searchTerm.trim()) {
      return this.pasaportes;
    }
    const termino = this.searchTerm.toLowerCase();
    return this.pasaportes.filter(c =>
      c.numero.toLowerCase().includes(termino) ||
      c.descripcion.toLowerCase().includes(termino) ||
      c.sede.toLowerCase().includes(termino)
    );
  }

  onSearchChange(): void {
    // El getter se actualiza automáticamente
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
  }

  goBack(): void {
    this.location.back();
  }

  verPasaporte(contrato: ContratoMock): void {
    this.router.navigate(['/pasaporte', contrato.id]);
  }

  getEstadoLabel(estado: string): string {
    return estado === 'habilitado' ? 'VIGENTE' : 'FINALIZADO';
  }

  getEstadoChipClass(estado: string): string {
    return estado === 'habilitado' ? 'chip-vigente' : 'chip-finalizado';
  }
}
