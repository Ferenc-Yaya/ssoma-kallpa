import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonasService } from '../../core/services/personas.service';
import { Persona } from '../../mocks/personas.mock';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { DOCUMENTOS_REQUERIBLES_MOCK, TIPOS_CONTRATISTAS_MOCK, RequisitoAsignado } from '../../mocks/reglas-negocio.mock';

interface Documento {
  id: number;
  nombre: string;
  categoria: string;
  obligatorio: boolean;
  archivo?: string;
  fechaSubida?: Date;
}

@Component({
  selector: 'app-personal-documentos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './personal-documentos.html',
  styleUrl: './personal-documentos.scss'
})
export class PersonalDocumentosComponent implements OnInit {
  persona?: Persona;
  personaId: number = 0;
  empresaId: number = 0;

  // Solo categorías de documentos de personal (no de empresa ni activos)
  categorias: string[] = ['PERSONAL', 'CONDUCTOR', 'OPERATIVOS'];

  documentos: Documento[] = [];
  documentosCargados: boolean = false;

  // Tipo de contratista por defecto (debería venir de la persona o empresa)
  tipoContratistaId: number = 1; // PERMANENTES por defecto

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personasService: PersonasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.personaId = Number(params['personaId']);
      this.empresaId = Number(params['id']);

      if (this.personaId) {
        this.loadPersona();
      }
    });
  }

  loadPersona(): void {
    this.personasService.getPersonaById(this.personaId).subscribe({
      next: (persona) => {
        if (persona) {
          this.persona = persona;
          // Cargar documentos requeridos según el tipo de contratista
          this.loadDocumentosRequeridos();
        } else {
          this.router.navigate(['/empresas', this.empresaId, 'personal']);
        }
      },
      error: () => {
        this.showMessage('Error al cargar información del trabajador', 'error');
        this.router.navigate(['/empresas', this.empresaId, 'personal']);
      }
    });
  }

  loadDocumentosRequeridos(): void {
    console.log('=== DEBUG loadDocumentosRequeridos ===');
    console.log('tipoContratistaId:', this.tipoContratistaId);
    console.log('TIPOS_CONTRATISTAS_MOCK:', TIPOS_CONTRATISTAS_MOCK);

    // Buscar el tipo de contratista
    const tipoContratista = TIPOS_CONTRATISTAS_MOCK.find(t => t.id === this.tipoContratistaId);
    console.log('tipoContratista encontrado:', tipoContratista);

    if (!tipoContratista) {
      this.showMessage('Tipo de contratista no encontrado', 'error');
      return;
    }

    console.log('Total requisitos:', tipoContratista.requisitos.length);

    // Filtrar solo los documentos que aplican para este tipo de contratista
    const requisitosAplicables = tipoContratista.requisitos.filter(req => req.aplica);
    console.log('Requisitos aplicables:', requisitosAplicables.length);
    console.log('Requisitos aplicables detalle:', requisitosAplicables);

    // Crear la lista de documentos con sus propiedades
    this.documentos = requisitosAplicables.map(req => ({
      id: req.documentoId,
      nombre: req.documentoNombre,
      categoria: req.categoriaRequisito,
      obligatorio: req.obligatorio,
      archivo: undefined, // Aquí cargarías desde el backend
      fechaSubida: undefined
    }));

    console.log('Documentos finales:', this.documentos);
    console.log('Documentos requeridos para tipo', tipoContratista.nombre, ':', this.documentos.length, 'documentos');

    // Marcar como cargados
    this.documentosCargados = true;

    // Forzar detección de cambios
    this.cdr.detectChanges();

    // Segundo intento después de un tick
    setTimeout(() => {
      console.log('=== Segundo detectChanges ===');
      console.log('documentos.length:', this.documentos.length);
      console.log('documentosCargados:', this.documentosCargados);
      this.cdr.detectChanges();
    }, 0);
  }

  getDocumentosPorCategoria(categoria: string): Documento[] {
    const docs = this.documentos.filter(doc => doc.categoria === categoria);
    console.log(`getDocumentosPorCategoria(${categoria}):`, docs.length, 'documentos');
    return docs;
  }

  getCategoriaColor(categoria: string): string {
    const colores: { [key: string]: string } = {
      'GENERALES': '#2196F3',
      'PERSONAL': '#4CAF50',
      'CONDUCTOR': '#FF9800',
      'VEHICULO': '#9C27B0',
      'HERRAMIENTAS': '#F44336',
      'OPERATIVOS': '#00BCD4',
      'OTROS': '#607D8B'
    };
    return colores[categoria] || '#666';
  }

  getCategoriaIcon(categoria: string): string {
    const iconos: { [key: string]: string } = {
      'GENERALES': 'business_center',
      'PERSONAL': 'person',
      'CONDUCTOR': 'local_shipping',
      'VEHICULO': 'directions_car',
      'HERRAMIENTAS': 'build',
      'OPERATIVOS': 'settings',
      'OTROS': 'more_horiz'
    };
    return iconos[categoria] || 'folder';
  }

  subirDocumento(documento: Documento): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,image/*';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Aquí iría la lógica para subir el archivo al backend
        console.log('Subiendo archivo:', file.name, 'para documento:', documento.nombre);

        // Simulación de éxito
        documento.archivo = file.name;
        documento.fechaSubida = new Date();
        this.showMessage(`Documento "${documento.nombre}" subido exitosamente`, 'success');
      }
    };

    input.click();
  }

  verDocumento(documento: Documento): void {
    if (documento.archivo) {
      // Aquí iría la lógica para abrir/descargar el documento
      console.log('Ver documento:', documento.archivo);
      this.showMessage('Abriendo documento...', 'success');
    }
  }

  eliminarDocumento(documento: Documento): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Documento',
        message: `¿Está seguro de eliminar el documento "${documento.nombre}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí iría la lógica para eliminar del backend
        documento.archivo = undefined;
        documento.fechaSubida = undefined;
        this.showMessage('Documento eliminado exitosamente', 'success');
      }
    });
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
