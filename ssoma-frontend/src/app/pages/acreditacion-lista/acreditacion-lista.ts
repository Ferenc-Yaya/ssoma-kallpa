import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AcreditacionService } from '../../core/services/acreditacion.service';
import { ContratoAcreditacion } from '../../mocks/acreditacion.mock';

@Component({
  selector: 'app-acreditacion-lista',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './acreditacion-lista.html',
  styleUrl: './acreditacion-lista.scss'
})
export class AcreditacionListaComponent implements OnInit {
  contratos: ContratoAcreditacion[] = [];

  constructor(
    private acreditacionService: AcreditacionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContratos();
  }

  loadContratos(): void {
    this.acreditacionService.getContratosPendientes().subscribe({
      next: (data) => {
        this.contratos = [...data];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar contratos:', error);
      }
    });
  }

  abrirAcreditacion(contratoId: number): void {
    this.router.navigate(['/acreditacion/contrato', contratoId]);
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'APTO': return '#22c55e';
      case 'OBSERVADO': return '#dc2626';
      case 'PENDIENTE': return '#ea580c';
      default: return '#6b7280';
    }
  }

  getNivelRiesgoColor(nivel: string): string {
    switch (nivel) {
      case 'BAJO': return '#22c55e';
      case 'MEDIO': return '#f59e0b';
      case 'ALTO': return '#ef4444';
      default: return '#6b7280';
    }
  }
}