import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivosService } from '../../core/services/activos.service';
import { Activo } from '../../mocks/activos.mock';
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
  selector: 'app-activo-documentos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './activo-documentos.html',
  styleUrl: './activo-documentos.scss'
})
export class ActivoDocumentosComponent implements OnInit {
  activo?: Activo;
  activoId: number = 0;
  empresaId: number = 0;

  // Categorías de documentos para activos
  categorias: string[] = [];

  documentos: Documento[] = [];
  documentosCargados: boolean = false;

  // Tipo de contratista por defecto (debería venir del activo o empresa)
  tipoContratistaId: number = 1; // PERMANENTES por defecto

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activosService: ActivosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.activoId = Number(params['activoId']);
      this.empresaId = Number(params['id']);

      if (this.activoId) {
        this.loadActivo();
      }
    });
  }

  loadActivo(): void {
    this.activosService.getActivoById(this.activoId).subscribe({
      next: (activo) => {
        if (activo) {
          this.activo = activo;

          // Determinar categorías según el tipo de activo
          if (activo.tipo_activo === 'VEHICULO') {
            this.categorias = ['VEHICULO'];
          } else if (activo.tipo_activo === 'HERRAMIENTA') {
            this.categorias = ['HERRAMIENTAS'];
          }

          // Cargar documentos requeridos según el tipo de contratista
          this.loadDocumentosRequeridos();
        } else {
          this.router.navigate(['/empresas', this.empresaId, 'activos']);
        }
      },
      error: () => {
        this.showMessage('Error al cargar información del activo', 'error');
        this.router.navigate(['/empresas', this.empresaId, 'activos']);
      }
    });
  }

  loadDocumentosRequeridos(): void {
    console.log('=== DEBUG loadDocumentosRequeridos ===');
    console.log('tipoContratistaId:', this.tipoContratistaId);

    // Buscar el tipo de contratista
    const tipoContratista = TIPOS_CONTRATISTAS_MOCK.find(t => t.id === this.tipoContratistaId);
    console.log('tipoContratista encontrado:', tipoContratista);

    if (!tipoContratista) {
      this.showMessage('Tipo de contratista no encontrado', 'error');
      return;
    }

    // Filtrar solo los documentos que aplican para este tipo de contratista
    // y que pertenecen a las categorías del activo
    const requisitosAplicables = tipoContratista.requisitos.filter(req =>
      req.aplica && this.categorias.includes(req.categoriaRequisito)
    );

    console.log('Requisitos aplicables:', requisitosAplicables.length);

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
