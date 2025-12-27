import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {
  TIPOS_CONTRATISTAS_MOCK,
  DOCUMENTOS_REQUERIBLES_MOCK,
  TipoContratista,
  DocumentoRequerible,
  RequisitoAsignado
} from '../../mocks/reglas-negocio.mock';
import { NuevoTipoDialogComponent } from './nuevo-tipo-dialog/nuevo-tipo-dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog';

@Component({
  selector: 'app-reglas-negocio',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './reglas-negocio.html',
  styleUrl: './reglas-negocio.scss'
})
export class ReglasNegocioComponent implements OnInit {
  tiposContratistas: TipoContratista[] = [];
  documentosRequeribles: DocumentoRequerible[] = [];
  categorias: string[] = ['GENERALES', 'PERSONAL', 'CONDUCTOR', 'VEHICULO', 'HERRAMIENTAS', 'OPERATIVOS', 'OTROS'];

  // Tipo seleccionado
  selectedTipoId: number = 1;
  tipoContratistaActual?: TipoContratista;

  // Indicadores de cambios guardados
  cambiosGuardados: boolean = true;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tiposContratistas = JSON.parse(JSON.stringify(TIPOS_CONTRATISTAS_MOCK)); // Deep copy
    this.documentosRequeribles = DOCUMENTOS_REQUERIBLES_MOCK;
    this.selectedTipoId = this.tiposContratistas[0]?.id || 1;
    this.tipoContratistaActual = this.tiposContratistas.find(t => t.id === this.selectedTipoId);
  }

  onTipoChange(): void {
    // Convertir a número porque el select devuelve string
    const tipoId = Number(this.selectedTipoId);
    this.tipoContratistaActual = this.tiposContratistas.find(t => t.id === tipoId);
    console.log('Tipo seleccionado:', tipoId, this.tipoContratistaActual);
  }

  seleccionarTipo(tipoId: number): void {
    this.selectedTipoId = tipoId;
    this.tipoContratistaActual = this.tiposContratistas.find(t => t.id === tipoId);
    console.log('Tipo seleccionado:', tipoId, this.tipoContratistaActual);
  }

  getRequisitosPorCategoria(categoria: string): RequisitoAsignado[] {
    if (!this.tipoContratistaActual) return [];
    return this.tipoContratistaActual.requisitos.filter(
      req => req.categoriaRequisito === categoria
    );
  }

  toggleAplica(requisito: RequisitoAsignado): void {
    requisito.aplica = !requisito.aplica;
    if (!requisito.aplica) {
      requisito.obligatorio = false; // Si no aplica, tampoco puede ser obligatorio
    }
    this.cambiosGuardados = false;
  }

  toggleObligatorio(requisito: RequisitoAsignado): void {
    if (requisito.aplica) {
      requisito.obligatorio = !requisito.obligatorio;
      this.cambiosGuardados = false;
    }
  }

  contarRequisitosAplican(categoria: string): number {
    return this.getRequisitosPorCategoria(categoria).filter(req => req.aplica).length;
  }

  contarRequisitosObligatorios(categoria: string): number {
    return this.getRequisitosPorCategoria(categoria).filter(req => req.aplica && req.obligatorio).length;
  }

  agregarNuevoTipo(): void {
    const dialogRef = this.dialog.open(NuevoTipoDialogComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Crear nuevo tipo de contratista
        const nuevoId = Math.max(...this.tiposContratistas.map(t => t.id)) + 1;

        // Inicializar todos los requisitos como no aplicables por defecto
        const requisitosIniciales: RequisitoAsignado[] = this.documentosRequeribles.map(doc => ({
          categoriaRequisito: doc.categoria,
          documentoId: doc.id,
          documentoNombre: doc.nombre,
          obligatorio: false,
          aplica: false
        }));

        const nuevoTipo: TipoContratista = {
          id: nuevoId,
          nombre: result.nombre,
          codigo: 'TIPO_' + nuevoId as any, // Código generado automáticamente
          descripcion: result.descripcion,
          requisitos: requisitosIniciales
        };

        this.tiposContratistas.push(nuevoTipo);

        // Seleccionar el nuevo tipo inmediatamente
        this.selectedTipoId = nuevoId;
        this.tipoContratistaActual = nuevoTipo;

        // Forzar detección de cambios
        this.cdr.detectChanges();

        this.cambiosGuardados = false;

        console.log('Nuevo tipo creado:', nuevoTipo);
      }
    });
  }

  eliminarTipoActual(): void {
    if (this.tiposContratistas.length <= 1) {
      this.dialog.open(InfoDialogComponent, {
        width: '450px',
        data: {
          title: 'No se puede eliminar',
          message: 'No se puede eliminar el último tipo de contratista. Debe existir al menos un tipo.'
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: '¿Eliminar tipo de contratista?',
        message: `¿Está seguro de eliminar el tipo "${this.tipoContratistaActual?.nombre}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const idToRemove = this.selectedTipoId;
        const indexToRemove = this.tiposContratistas.findIndex(t => t.id === idToRemove);

        this.tiposContratistas.splice(indexToRemove, 1);

        // Seleccionar otro tipo
        const newIndex = Math.max(0, indexToRemove - 1);
        this.selectedTipoId = this.tiposContratistas[newIndex].id;
        this.tipoContratistaActual = this.tiposContratistas[newIndex];

        // Forzar detección de cambios
        this.cdr.detectChanges();

        this.cambiosGuardados = false;
      }
    });
  }

  guardarCambios(): void {
    // Aquí iría la lógica para guardar en el backend
    console.log('Guardando cambios:', this.tiposContratistas);
    this.cambiosGuardados = true;

    // Simulación de guardado exitoso
    alert('Configuración de reglas de negocio guardada exitosamente');
  }

  resetearCambios(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: '¿Resetear cambios?',
        message: '¿Está seguro de resetear todos los cambios? Se perderán las modificaciones no guardadas.'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.tiposContratistas = JSON.parse(JSON.stringify(TIPOS_CONTRATISTAS_MOCK));
        this.selectedTipoId = this.tiposContratistas[0]?.id || 1;
        this.tipoContratistaActual = this.tiposContratistas.find(t => t.id === this.selectedTipoId);
        this.cambiosGuardados = true;
      }
    });
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
    return colores[categoria] || '#000000';
  }

  exportarConfiguracion(): void {
    const dataStr = JSON.stringify(this.tiposContratistas, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'reglas-negocio-config.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}
