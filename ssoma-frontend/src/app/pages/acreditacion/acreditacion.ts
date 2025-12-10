import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DocumentosService } from '../../core/services/documentos';
import { Documento } from '../../mocks/documentos.mock';

@Component({
  selector: 'app-acreditacion',
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
    MatSelectModule,
    MatSnackBarModule,
    NgxExtendedPdfViewerModule
  ],
  templateUrl: './acreditacion.html',
  styleUrl: './acreditacion.scss'
})
export class AcreditacionComponent implements OnInit {
  documentos: Documento[] = [];
  documentosFiltrados: Documento[] = [];
  documentoSeleccionado: Documento | null = null;
  filtroEstado: string = 'TODOS';
  observaciones: string = '';

  constructor(
    private documentosService: DocumentosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDocumentos();
  }

  loadDocumentos(): void {
    this.documentosService.getDocumentos().subscribe({
      next: (data) => {
        this.documentos = data;
        this.aplicarFiltro();
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
        this.showMessage('Error al cargar documentos', 'error');
      }
    });
  }

  aplicarFiltro(): void {
    if (this.filtroEstado === 'TODOS') {
      this.documentosFiltrados = this.documentos;
    } else {
      this.documentosFiltrados = this.documentos.filter(
        doc => doc.estado === this.filtroEstado
      );
    }
  }

  seleccionarDocumento(documento: Documento): void {
    this.documentoSeleccionado = documento;
    this.observaciones = documento.observaciones || '';
  }

  aprobarDocumento(): void {
    if (!this.documentoSeleccionado) return;

    this.documentosService.updateEstado(
      this.documentoSeleccionado.id,
      'APROBADO'
    ).subscribe({
      next: () => {
        this.showMessage('Documento aprobado exitosamente');
        this.loadDocumentos();
        this.documentoSeleccionado = null;
      },
      error: () => {
        this.showMessage('Error al aprobar documento', 'error');
      }
    });
  }

  observarDocumento(): void {
    if (!this.documentoSeleccionado || !this.observaciones.trim()) {
      this.showMessage('Debe ingresar observaciones', 'error');
      return;
    }

    this.documentosService.updateEstado(
      this.documentoSeleccionado.id,
      'OBSERVADO',
      this.observaciones
    ).subscribe({
      next: () => {
        this.showMessage('Documento observado exitosamente');
        this.loadDocumentos();
        this.documentoSeleccionado = null;
        this.observaciones = '';
      },
      error: () => {
        this.showMessage('Error al observar documento', 'error');
      }
    });
  }

  rechazarDocumento(): void {
    if (!this.documentoSeleccionado || !this.observaciones.trim()) {
      this.showMessage('Debe ingresar motivo de rechazo', 'error');
      return;
    }

    if (confirm('¿Está seguro de rechazar este documento?')) {
      this.documentosService.updateEstado(
        this.documentoSeleccionado.id,
        'RECHAZADO',
        this.observaciones
      ).subscribe({
        next: () => {
          this.showMessage('Documento rechazado');
          this.loadDocumentos();
          this.documentoSeleccionado = null;
          this.observaciones = '';
        },
        error: () => {
          this.showMessage('Error al rechazar documento', 'error');
        }
      });
    }
  }

  private showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
