import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { AcreditacionService } from '../../core/services/acreditacion.service';
import { ChangeDetectorRef } from '@angular/core';
import { 
  ContratoAcreditacion, 
  DocumentoAcreditacion,
  PersonaAcreditacion,
  ActivoAcreditacion,
  MaterialAcreditacion
} from '../../mocks/acreditacion.mock';

@Component({
  selector: 'app-acreditacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './acreditacion.html',
  styleUrl: './acreditacion.scss'
})
export class AcreditacionComponent implements OnInit {
  contrato: ContratoAcreditacion | null = null;
  documentoSeleccionado: DocumentoAcreditacion | null = null;
  motivoRechazo: string = '';
  loading: boolean = false;

  // Para saber de qué entidad es el documento seleccionado
  entidadSeleccionada: {
    tipo: 'PERSONA' | 'ACTIVO' | 'MATERIAL' | 'CONTRATO';
    nombre: string;
    foto?: string;
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private acreditacionService: AcreditacionService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef  // <-- AGREGAR
  ) {}

  ngOnInit(): void {
    const contratoId = this.route.snapshot.paramMap.get('id');
    if (contratoId) {
      this.loadContrato(Number(contratoId));
    }
  }

  loadContrato(contratoId: number): void {
    this.loading = true;
    console.log('🔍 Cargando contrato ID:', contratoId);
    
    this.acreditacionService.getContratoById(contratoId).subscribe({
      next: (contrato) => {
        console.log('✅ Contrato recibido:', contrato);
        if (contrato) {
          this.contrato = contrato;
          this.loading = false;
          this.cdr.detectChanges(); // <-- AGREGAR ESTO
        } else {
          console.log('❌ Contrato no encontrado');
          this.showMessage('Contrato no encontrado', 'error');
          this.router.navigate(['/acreditacion']);
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        this.showMessage('Error al cargar contrato', 'error');
        this.loading = false;
        this.cdr.detectChanges(); // <-- AGREGAR ESTO
      }
    });
  }

  seleccionarDocumento(
    documento: DocumentoAcreditacion,
    entidadTipo: 'PERSONA' | 'ACTIVO' | 'MATERIAL' | 'CONTRATO',
    entidadNombre: string,
    foto?: string
  ): void {
    this.documentoSeleccionado = documento;
    this.entidadSeleccionada = {
      tipo: entidadTipo,
      nombre: entidadNombre,
      foto: foto
    };
    this.motivoRechazo = documento.motivo_rechazo || '';
  }

  aprobarDocumento(): void {
    if (!this.contrato || !this.documentoSeleccionado) return;

    this.acreditacionService.aprobarDocumento(
      this.contrato.contrato_id,
      this.documentoSeleccionado.documento_id,
      'Admin SSOMA'
    ).subscribe({
      next: (success) => {
        if (success) {
          this.showMessage('Documento aprobado exitosamente', 'success');
          this.loadContrato(this.contrato!.contrato_id);
          
          // Verificar si todos los documentos están aprobados
          if (this.contrato!.estado_acreditacion === 'APTO') {
            this.showMessage('🎉 ¡CONTRATO COMPLETAMENTE ACREDITADO!', 'success');
          }
        }
      },
      error: () => {
        this.showMessage('Error al aprobar documento', 'error');
      }
    });
  }

  rechazarDocumento(): void {
    if (!this.contrato || !this.documentoSeleccionado) return;

    if (!this.motivoRechazo.trim()) {
      this.showMessage('Debe ingresar un motivo de rechazo', 'error');
      return;
    }

    this.acreditacionService.rechazarDocumento(
      this.contrato.contrato_id,
      this.documentoSeleccionado.documento_id,
      this.motivoRechazo,
      'Admin SSOMA'
    ).subscribe({
      next: (success) => {
        if (success) {
          this.showMessage('Documento rechazado', 'success');
          this.loadContrato(this.contrato!.contrato_id);
          this.motivoRechazo = '';
        }
      },
      error: () => {
        this.showMessage('Error al rechazar documento', 'error');
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'APROBADO': return '#22c55e';
      case 'RECHAZADO': return '#ef4444';
      case 'PENDIENTE': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'APROBADO': return 'check_circle';
      case 'RECHAZADO': return 'cancel';
      case 'PENDIENTE': return 'schedule';
      default: return 'help';
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

  contarDocumentosPorEstado(
    documentos: DocumentoAcreditacion[],
    estado: string
  ): number {
    return documentos.filter(d => d.estado_revision === estado).length;
  }

  private showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  volverALista(): void {
    this.router.navigate(['/acreditacion']);
  }
}