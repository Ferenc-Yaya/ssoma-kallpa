import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NuevoTipoDialogComponent } from './nuevo-tipo-dialog/nuevo-tipo-dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog';
import { TiposContratistaService, TipoContratista } from '../../core/services/tipos-contratista.service';

interface Requisito {
  id: string;
  documentoNombre: string;
  categoria: string;
  aplica: boolean;
  obligatorio: boolean;
}

interface TipoContratistaLocal {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  requisitos: Requisito[];
}

@Component({
  selector: 'app-reglas-negocio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './reglas-negocio.html',
  styleUrl: './reglas-negocio.scss'
})
export class ReglasNegocioComponent implements OnInit {
  tiposContratistas: TipoContratistaLocal[] = [];
  selectedTipoId: string = '';
  tipoContratistaActual: TipoContratistaLocal | null = null;
  cambiosGuardados: boolean = true;

  categorias: string[] = [
    'EMPRESA',
    'PERSONAL',
    'VEHICULO',
    'EQUIPO',
    'MATERIAL PELIGROSO'
  ];

  // Colores por categoría
  private coloresCategorias: { [key: string]: string } = {
    'EMPRESA': '#1976d2',
    'PERSONAL': '#388e3c',
    'VEHICULO': '#f57c00',
    'EQUIPO': '#7b1fa2',
    'MATERIAL PELIGROSO': '#d32f2f'
  };

  // Documentos base por categoría
  private documentosBase: { categoria: string; documentos: string[] }[] = [
    {
      categoria: 'EMPRESA',
      documentos: [
        'Ficha RUC vigente',
        'Constancia de inscripción en REMYPE',
        'Certificado SCTR Salud',
        'Certificado SCTR Pensión',
        'Póliza de Responsabilidad Civil',
        'Contrato vigente',
        'Licencia de funcionamiento',
        'Certificado de homologación',
        'Plan de seguridad y salud',
        'Reglamento interno de trabajo'
      ]
    },
    {
      categoria: 'PERSONAL',
      documentos: [
        'DNI vigente',
        'Fotocheck de la empresa',
        'Certificado de aptitud médica',
        'Certificado de trabajo en altura',
        'Certificado de espacios confinados',
        'Inducción de seguridad',
        'Capacitación específica',
        'Seguro vida ley',
        'Contrato de trabajo',
        'Examen psicológico'
      ]
    },
    {
      categoria: 'VEHICULO',
      documentos: [
        'Tarjeta de propiedad',
        'SOAT vigente',
        'Revisión técnica',
        'Certificado de operatividad',
        'Licencia de conducir del operador',
        'Póliza vehicular',
        'Check list de inspección',
        'Certificado de GPS'
      ]
    },
    {
      categoria: 'EQUIPO',
      documentos: [
        'Certificado de calibración',
        'Ficha técnica del equipo',
        'Manual de operación',
        'Certificado de operatividad',
        'Registro de mantenimiento',
        'Check list de inspección'
      ]
    },
    {
      categoria: 'MATERIAL PELIGROSO',
      documentos: [
        'Hoja de seguridad (MSDS)',
        'Certificado de calidad',
        'Registro sanitario',
        'Autorización de transporte',
        'Plan de contingencia',
        'Ficha técnica del producto'
      ]
    }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private tiposContratistaService: TiposContratistaService
  ) {}

  ngOnInit(): void {
    this.cargarTiposContratista();
  }

  cargarTiposContratista(): void {
    this.tiposContratistaService.getAll().subscribe({
      next: (tipos) => {
        this.tiposContratistas = tipos.map(tipo => ({
          id: tipo.tipoId,
          nombre: tipo.nombre,
          codigo: tipo.codigo,
          descripcion: tipo.descripcion,
          requisitos: this.generarRequisitosIniciales()
        }));

        if (this.tiposContratistas.length > 0) {
          this.seleccionarTipo(this.tiposContratistas[0].id);
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de contratista:', error);
        this.cargarDatosPrueba();
      }
    });
  }

  cargarDatosPrueba(): void {
    this.tiposContratistas = [
      {
        id: '1',
        nombre: 'Contratista General',
        codigo: 'CG',
        descripcion: 'Contratista que realiza trabajos generales',
        requisitos: this.generarRequisitosIniciales()
      },
      {
        id: '2',
        nombre: 'Contratista Especializado',
        codigo: 'CE',
        descripcion: 'Contratista con trabajos especializados',
        requisitos: this.generarRequisitosIniciales()
      },
      {
        id: '3',
        nombre: 'Proveedor',
        codigo: 'PR',
        descripcion: 'Proveedor de bienes y servicios',
        requisitos: this.generarRequisitosIniciales()
      }
    ];

    if (this.tiposContratistas.length > 0) {
      this.seleccionarTipo(this.tiposContratistas[0].id);
    }
  }

  generarRequisitosIniciales(): Requisito[] {
    const requisitos: Requisito[] = [];
    let idCounter = 1;

    this.documentosBase.forEach(cat => {
      cat.documentos.forEach(doc => {
        requisitos.push({
          id: `req-${idCounter++}`,
          documentoNombre: doc,
          categoria: cat.categoria,
          aplica: true,
          obligatorio: false
        });
      });
    });

    return requisitos;
  }

  seleccionarTipo(tipoId: string): void {
    this.selectedTipoId = tipoId;
    this.tipoContratistaActual = this.tiposContratistas.find(t => t.id === tipoId) || null;
  }

  getRequisitosPorCategoria(categoria: string): Requisito[] {
    if (!this.tipoContratistaActual) return [];
    return this.tipoContratistaActual.requisitos.filter(r => r.categoria === categoria);
  }

  getCategoriaColor(categoria: string): string {
    return this.coloresCategorias[categoria] || '#607d8b';
  }

  contarRequisitosAplican(categoria: string): number {
    return this.getRequisitosPorCategoria(categoria).filter(r => r.aplica).length;
  }

  contarRequisitosObligatorios(categoria: string): number {
    return this.getRequisitosPorCategoria(categoria).filter(r => r.aplica && r.obligatorio).length;
  }

  toggleAplica(requisito: Requisito): void {
    this.cambiosGuardados = false;
    if (!requisito.aplica) {
      requisito.obligatorio = false;
    }
  }

  toggleObligatorio(requisito: Requisito): void {
    this.cambiosGuardados = false;
  }

  agregarNuevoTipo(): void {
    const dialogRef = this.dialog.open(NuevoTipoDialogComponent, {
      width: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevoTipo: TipoContratistaLocal = {
          id: `tipo-${Date.now()}`,
          nombre: result.nombre,
          codigo: this.generarCodigo(result.nombre),
          descripcion: result.descripcion || '',
          requisitos: this.generarRequisitosIniciales()
        };
        this.tiposContratistas.push(nuevoTipo);
        this.seleccionarTipo(nuevoTipo.id);
        this.cambiosGuardados = false;
        this.snackBar.open('Tipo de contratista agregado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  generarCodigo(nombre: string): string {
    const palabras = nombre.split(' ').filter(p => p.length > 2);
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

  eliminarTipoActual(): void {
    if (!this.tipoContratistaActual || this.tiposContratistas.length <= 1) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar tipo de contratista',
        message: `¿Está seguro de eliminar el tipo "${this.tipoContratistaActual.nombre}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        const index = this.tiposContratistas.findIndex(t => t.id === this.selectedTipoId);
        if (index > -1) {
          this.tiposContratistas.splice(index, 1);
          this.seleccionarTipo(this.tiposContratistas[0].id);
          this.cambiosGuardados = false;
          this.snackBar.open('Tipo de contratista eliminado', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  guardarCambios(): void {
    // Aquí iría la lógica para guardar en el backend
    console.log('Guardando configuración:', this.tiposContratistas);
    this.cambiosGuardados = true;
    this.snackBar.open('Cambios guardados correctamente', 'Cerrar', { duration: 3000 });
  }

  resetearCambios(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Resetear cambios',
        message: '¿Está seguro de resetear todos los cambios? Se perderán las modificaciones no guardadas.'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.cargarTiposContratista();
        this.cambiosGuardados = true;
        this.snackBar.open('Cambios reseteados', 'Cerrar', { duration: 3000 });
      }
    });
  }

  exportarConfiguracion(): void {
    const config = {
      fechaExportacion: new Date().toISOString(),
      tiposContratista: this.tiposContratistas
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reglas-negocio-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Configuración exportada', 'Cerrar', { duration: 3000 });
  }
}
