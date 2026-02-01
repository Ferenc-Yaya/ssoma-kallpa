import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CONTRATOS_MOCK, ContratoMock } from '../../mocks/contratos.mock';

interface PersonalPasaporte {
  nombre: string;
  dni: string;
  cargo: string;
}

interface VehiculoPasaporte {
  placa: string;
  tipo: string;
  marca: string;
}

interface HerramientaPasaporte {
  nombre: string;
  codigo: string;
}

@Component({
  selector: 'app-pasaporte-contrato',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './pasaporte-contrato.html',
  styleUrl: './pasaporte-contrato.scss'
})
export class PasaporteContratoComponent implements OnInit {
  contratoId: string = '';
  contrato: ContratoMock | null = null;
  qrCodeUrl: string = '';
  fechaEmision: string = '';
  fechaVencimiento: string = '';
  codigoPasaporte: string = '';

  // Datos simulados del pasaporte
  personalHabilitado: PersonalPasaporte[] = [
    { nombre: 'Juan Carlos Pérez García', dni: '12345678', cargo: 'Electricista' },
    { nombre: 'María Elena López Rodríguez', dni: '87654321', cargo: 'Técnico Electricista' },
    { nombre: 'Ana Lucía Mendoza Quispe', dni: '32165498', cargo: 'Ayudante' },
    { nombre: 'Carlos Alberto Ramírez Vega', dni: '78945612', cargo: 'Electricista' }
  ];

  vehiculosHabilitados: VehiculoPasaporte[] = [
    { placa: 'ABC-123', tipo: 'Camioneta', marca: 'Toyota Hilux' },
    { placa: 'XYZ-789', tipo: 'Furgoneta', marca: 'Hyundai H100' }
  ];

  herramientasHabilitadas: HerramientaPasaporte[] = [
    { nombre: 'Taladro Industrial', codigo: 'TAL-001' },
    { nombre: 'Multímetro Digital', codigo: 'MUL-002' },
    { nombre: 'Amoladora Angular', codigo: 'AMO-003' }
  ];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contratoId = params['id'] || '1';
      this.cargarContrato();
    });
  }

  cargarContrato(): void {
    this.contrato = CONTRATOS_MOCK.find(c => c.id === this.contratoId) || null;

    if (this.contrato) {
      // Generar código único del pasaporte
      this.codigoPasaporte = `PASS-${this.contrato.numero.replace(' ', '-')}-${new Date().getFullYear()}`;

      // Fechas
      this.fechaEmision = new Date().toLocaleDateString('es-PE');
      this.fechaVencimiento = this.contrato.fechaFin;

      // URL del QR (usando API de QR gratuita)
      const qrData = encodeURIComponent(`https://ssoma.kallpa.com/verificar/${this.codigoPasaporte}`);
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
    }
  }

  goBack(): void {
    this.location.back();
  }

  descargarPDF(): void {
    // Simular descarga de PDF
    this.snackBar.open('Generando PDF del pasaporte...', 'Cerrar', { duration: 2000 });

    setTimeout(() => {
      this.snackBar.open('PDF descargado correctamente', 'Cerrar', { duration: 3000 });
    }, 2000);
  }

  imprimirPasaporte(): void {
    window.print();
  }

  copiarCodigo(): void {
    navigator.clipboard.writeText(this.codigoPasaporte);
    this.snackBar.open('Código copiado al portapapeles', 'Cerrar', { duration: 2000 });
  }

  getEstadoClass(): string {
    if (!this.contrato) return '';
    return this.contrato.estado === 'habilitado' ? 'estado-vigente' : 'estado-finalizado';
  }

  getEstadoLabel(): string {
    if (!this.contrato) return '';
    return this.contrato.estado === 'habilitado' ? 'VIGENTE' : 'FINALIZADO';
  }
}
