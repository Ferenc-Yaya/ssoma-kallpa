import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QRCodeComponent } from 'angularx-qrcode';
import { ContratosService } from '../../core/services/contratos.service';
import { PersonasService } from '../../core/services/personas.service';
import { Contrato } from '../../mocks/contratos.mock';
import { Persona } from '../../mocks/personas.mock';

@Component({
  selector: 'app-pasaporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    QRCodeComponent
  ],
  templateUrl: './pasaporte.html',
  styleUrl: './pasaporte.scss'
})
export class PasaporteComponent implements OnInit {
  contratos: Contrato[] = [];
  contratoSeleccionado: Contrato | null = null;
  trabajadoresContrato: Persona[] = [];
  numeroBusqueda: string = '';
  qrData: string = '';

  constructor(
    private contratosService: ContratosService,
    private personasService: PersonasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadContratoById(Number(id));
    } else {
      this.loadContratos();
    }
  }

  loadContratos(): void {
    this.contratosService.getContratos().subscribe({
      next: (data) => {
        this.contratos = data;
      },
      error: (error) => {
        console.error('Error al cargar contratos:', error);
      }
    });
  }

  loadContratoById(id: number): void {
    this.contratosService.getContratoById(id).subscribe({
      next: (contrato) => {
        if (contrato) {
          this.seleccionarContrato(contrato);
        }
      }
    });
  }

  buscarPorNumero(): void {
    if (!this.numeroBusqueda.trim()) return;

    this.contratosService.getContratoByNumero(this.numeroBusqueda).subscribe({
      next: (contrato) => {
        if (contrato) {
          this.seleccionarContrato(contrato);
        } else {
          alert('No se encontró contrato con ese número');
        }
      }
    });
  }

  seleccionarContrato(contrato: Contrato): void {
    this.contratoSeleccionado = contrato;
    this.loadTrabajadores(contrato);
    this.generarQRData(contrato);
  }

  loadTrabajadores(contrato: Contrato): void {
    this.personasService.getPersonasByEmpresa(contrato.empresa_id).subscribe({
      next: (personas) => {
        // Filtrar solo los trabajadores de este contrato
        this.trabajadoresContrato = personas.filter(p => 
          contrato.trabajadores_ids.includes(p.persona_id)
        );
      },
      error: (error) => {
        console.error('Error al cargar trabajadores:', error);
      }
    });
  }

  generarQRData(contrato: Contrato): void {
    // El QR contiene la URL para verificar el contrato
    const baseUrl = window.location.origin;
    this.qrData = `${baseUrl}/public/pasaporte/${contrato.qr_code}`;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'APTO': return '#22c55e';
      case 'OBSERVADO': return '#eab308';
      case 'PENDIENTE': return '#f59e0b';
      case 'BLOQUEADO': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'APTO': return 'check_circle';
      case 'OBSERVADO': return 'warning';
      case 'PENDIENTE': return 'schedule';
      case 'BLOQUEADO': return 'cancel';
      default: return 'help';
    }
  }

  getNivelRiesgoColor(nivel: string): string {
    switch (nivel) {
      case 'BAJO': return '#22c55e';
      case 'MEDIO': return '#eab308';
      case 'ALTO': return '#ef4444';
      default: return '#6b7280';
    }
  }

  imprimirPasaporte(): void {
    window.print();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-PE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getDiasVigencia(): number {
    if (!this.contratoSeleccionado) return 0;
    const hoy = new Date();
    const fin = new Date(this.contratoSeleccionado.fecha_fin);
    const diff = fin.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  volverALista(): void {
    this.contratoSeleccionado = null;
    this.trabajadoresContrato = [];
  }
}