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
import { TrabajadoresService } from '../../core/services/trabajadores';
import { Trabajador } from '../../mocks/trabajadores.mock';

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
  trabajadores: Trabajador[] = [];
  trabajadorSeleccionado: Trabajador | null = null;
  dniBusqueda: string = '';
  qrData: string = '';

  constructor(
    private trabajadoresService: TrabajadoresService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrabajadorById(Number(id));
    } else {
      this.loadTrabajadores();
    }
  }

  loadTrabajadores(): void {
    this.trabajadoresService.getTrabajadores().subscribe({
      next: (data) => {
        this.trabajadores = data;
      },
      error: (error) => {
        console.error('Error al cargar trabajadores:', error);
      }
    });
  }

  loadTrabajadorById(id: number): void {
    this.trabajadoresService.getTrabajadorById(id).subscribe({
      next: (trabajador) => {
        if (trabajador) {
          this.seleccionarTrabajador(trabajador);
        }
      }
    });
  }

  buscarPorDni(): void {
    if (!this.dniBusqueda.trim()) return;

    this.trabajadoresService.getTrabajadorByDni(this.dniBusqueda).subscribe({
      next: (trabajador) => {
        if (trabajador) {
          this.seleccionarTrabajador(trabajador);
        } else {
          alert('No se encontró trabajador con ese DNI');
        }
      }
    });
  }

  seleccionarTrabajador(trabajador: Trabajador): void {
    this.trabajadorSeleccionado = trabajador;
    this.generarQRData(trabajador);
  }

  generarQRData(trabajador: Trabajador): void {
    this.qrData = JSON.stringify({
      dni: trabajador.dni,
      nombre: `${trabajador.nombre} ${trabajador.apellidos}`,
      empresa: trabajador.empresaNombre,
      estado: trabajador.estadoAcreditacion,
      vigencia: trabajador.fechaVencimiento
    });
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
}