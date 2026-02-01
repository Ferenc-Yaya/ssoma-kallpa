import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface Documento {
  id: string;
  nombre: string;
  fechaVencimiento: string;
  estado: 'vigente' | 'por_vencer' | 'vencido';
  archivoUrl?: string;
}

interface Personal {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  cargo: string;
  estado: 'habilitado' | 'por_vencer' | 'vencido' | 'pendiente';
  documentos: Documento[];
}

interface Herramienta {
  id: string;
  nombre: string;
  codigo: string;
  marca: string;
  modelo: string;
  estado: 'habilitado' | 'por_vencer' | 'vencido' | 'pendiente';
  documentos: Documento[];
}

interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: string;
  estado: 'habilitado' | 'por_vencer' | 'vencido' | 'pendiente';
  documentos: Documento[];
}

interface MaterialPeligroso {
  id: string;
  nombre: string;
  codigoONU: string;
  clase: string;
  cantidad: number;
  unidad: string;
  estado: 'habilitado' | 'por_vencer' | 'vencido' | 'pendiente';
  documentos: Documento[];
}

interface DocumentoEmpresa {
  id: string;
  tipoDocumento: string;
  nombre: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: 'vigente' | 'por_vencer' | 'vencido' | 'pendiente';
  archivoUrl?: string;
}

interface ContratoDetalle {
  id: string;
  numero: string;
  descripcion: string;
  sede: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'nuevo' | 'habilitado' | 'parcial' | 'finalizado';
  personal: Personal[];
  herramientas: Herramienta[];
  vehiculos: Vehiculo[];
  materialesPeligrosos: MaterialPeligroso[];
  documentos: DocumentoEmpresa[];
}

@Component({
  selector: 'app-mis-contratos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './mis-contratos.html',
  styleUrl: './mis-contratos.scss'
})
export class MisContratosComponent implements OnInit {
  contratoId: string = '';
  contrato: ContratoDetalle | null = null;
  selectedTabIndex = 0;

  // Para el formulario de agregar/editar
  mostrarFormulario = false;
  formularioTipo: 'personal' | 'herramienta' | 'vehiculo' | 'material' | 'documento' = 'personal';
  editandoId: string | null = null;

  // Formularios
  personalForm: FormGroup;
  herramientaForm: FormGroup;
  vehiculoForm: FormGroup;
  materialForm: FormGroup;
  documentoForm: FormGroup;

  // Archivo seleccionado
  archivoSeleccionado: File | null = null;

  // Datos simulados
  private contratosSimulados: ContratoDetalle[] = [
    // Contrato nuevo - sin datos
    {
      id: '0',
      numero: 'OC 4500030478',
      descripcion: 'Servicio de soldadura y montaje estructural - Proyecto Ampliación',
      sede: 'Cañón del Pato',
      fechaInicio: '2024-07-01',
      fechaFin: '2024-12-31',
      estado: 'nuevo',
      personal: [],
      herramientas: [],
      vehiculos: [],
      materialesPeligrosos: [],
      documentos: []
    },
    {
      id: '1',
      numero: 'OC 4500030125',
      descripcion: 'Mantenimiento de instalaciones eléctricas - Sede Central',
      sede: 'Cañón del Pato',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-12-31',
      estado: 'habilitado',
      personal: [
        {
          id: 'p1',
          nombres: 'Juan Carlos',
          apellidos: 'Pérez García',
          dni: '12345678',
          cargo: 'Electricista',
          estado: 'habilitado',
          documentos: [
            { id: 'd1', nombre: 'SCTR Salud', fechaVencimiento: '2024-12-31', estado: 'vigente' },
            { id: 'd2', nombre: 'SCTR Pensión', fechaVencimiento: '2024-12-31', estado: 'vigente' },
            { id: 'd3', nombre: 'Examen Médico', fechaVencimiento: '2024-08-15', estado: 'vigente' }
          ]
        },
        {
          id: 'p2',
          nombres: 'María Elena',
          apellidos: 'López Rodríguez',
          dni: '87654321',
          cargo: 'Técnico Electricista',
          estado: 'por_vencer',
          documentos: [
            { id: 'd4', nombre: 'SCTR Salud', fechaVencimiento: '2024-07-20', estado: 'por_vencer' },
            { id: 'd5', nombre: 'SCTR Pensión', fechaVencimiento: '2024-07-20', estado: 'por_vencer' },
            { id: 'd6', nombre: 'Examen Médico', fechaVencimiento: '2024-09-01', estado: 'vigente' }
          ]
        },
        {
          id: 'p3',
          nombres: 'Roberto',
          apellidos: 'Sánchez Torres',
          dni: '45678912',
          cargo: 'Supervisor',
          estado: 'vencido',
          documentos: [
            { id: 'd7', nombre: 'SCTR Salud', fechaVencimiento: '2024-06-01', estado: 'vencido' },
            { id: 'd8', nombre: 'SCTR Pensión', fechaVencimiento: '2024-06-01', estado: 'vencido' },
            { id: 'd9', nombre: 'Examen Médico', fechaVencimiento: '2024-05-15', estado: 'vencido' }
          ]
        },
        {
          id: 'p4',
          nombres: 'Ana Lucía',
          apellidos: 'Mendoza Quispe',
          dni: '32165498',
          cargo: 'Ayudante',
          estado: 'habilitado',
          documentos: [
            { id: 'd10', nombre: 'SCTR Salud', fechaVencimiento: '2024-11-30', estado: 'vigente' },
            { id: 'd11', nombre: 'SCTR Pensión', fechaVencimiento: '2024-11-30', estado: 'vigente' }
          ]
        },
        {
          id: 'p5',
          nombres: 'Carlos Alberto',
          apellidos: 'Ramírez Vega',
          dni: '78945612',
          cargo: 'Electricista',
          estado: 'habilitado',
          documentos: [
            { id: 'd12', nombre: 'SCTR Salud', fechaVencimiento: '2024-10-15', estado: 'vigente' },
            { id: 'd13', nombre: 'Licencia de Conducir', fechaVencimiento: '2025-03-20', estado: 'vigente' }
          ]
        }
      ],
      herramientas: [
        {
          id: 'h1',
          nombre: 'Taladro Industrial',
          codigo: 'TAL-001',
          marca: 'DeWalt',
          modelo: 'DWD520',
          estado: 'habilitado',
          documentos: [
            { id: 'hd1', nombre: 'Certificado de Calibración', fechaVencimiento: '2024-12-31', estado: 'vigente' }
          ]
        },
        {
          id: 'h2',
          nombre: 'Multímetro Digital',
          codigo: 'MUL-002',
          marca: 'Fluke',
          modelo: '117',
          estado: 'habilitado',
          documentos: [
            { id: 'hd2', nombre: 'Certificado de Calibración', fechaVencimiento: '2024-09-30', estado: 'vigente' }
          ]
        },
        {
          id: 'h3',
          nombre: 'Amoladora Angular',
          codigo: 'AMO-003',
          marca: 'Bosch',
          modelo: 'GWS 7-115',
          estado: 'por_vencer',
          documentos: [
            { id: 'hd3', nombre: 'Inspección de Seguridad', fechaVencimiento: '2024-07-10', estado: 'por_vencer' }
          ]
        }
      ],
      vehiculos: [
        {
          id: 'v1',
          placa: 'ABC-123',
          marca: 'Toyota',
          modelo: 'Hilux',
          anio: 2022,
          tipo: 'Camioneta',
          estado: 'habilitado',
          documentos: [
            { id: 'vd1', nombre: 'SOAT', fechaVencimiento: '2024-12-15', estado: 'vigente' },
            { id: 'vd2', nombre: 'Revisión Técnica', fechaVencimiento: '2024-11-20', estado: 'vigente' }
          ]
        },
        {
          id: 'v2',
          placa: 'XYZ-789',
          marca: 'Hyundai',
          modelo: 'H100',
          anio: 2021,
          tipo: 'Furgoneta',
          estado: 'habilitado',
          documentos: [
            { id: 'vd3', nombre: 'SOAT', fechaVencimiento: '2024-10-01', estado: 'vigente' },
            { id: 'vd4', nombre: 'Revisión Técnica', fechaVencimiento: '2024-09-15', estado: 'vigente' }
          ]
        }
      ],
      materialesPeligrosos: [],
      documentos: [
        {
          id: 'de1',
          tipoDocumento: 'Póliza de Seguro',
          nombre: 'Póliza de Responsabilidad Civil',
          fechaEmision: '2024-01-01',
          fechaVencimiento: '2024-12-31',
          estado: 'vigente'
        },
        {
          id: 'de2',
          tipoDocumento: 'Certificación',
          nombre: 'ISO 9001:2015',
          fechaEmision: '2023-06-15',
          fechaVencimiento: '2026-06-14',
          estado: 'vigente'
        },
        {
          id: 'de3',
          tipoDocumento: 'Licencia',
          nombre: 'Licencia de Funcionamiento',
          fechaEmision: '2023-01-01',
          fechaVencimiento: '2024-07-25',
          estado: 'por_vencer'
        }
      ]
    },
    // Contrato con materiales peligrosos
    {
      id: '2',
      numero: 'OS 4500028734',
      descripcion: 'Servicio de limpieza industrial - Planta Norte',
      sede: 'Cerro del Águila',
      fechaInicio: '2024-02-01',
      fechaFin: '2024-06-30',
      estado: 'parcial',
      personal: [
        {
          id: 'p2-1',
          nombres: 'Pedro Antonio',
          apellidos: 'Flores Mendez',
          dni: '11223344',
          cargo: 'Jefe de Cuadrilla',
          estado: 'habilitado',
          documentos: [
            { id: 'd2-1', nombre: 'SCTR Salud', fechaVencimiento: '2024-11-30', estado: 'vigente' },
            { id: 'd2-2', nombre: 'SCTR Pensión', fechaVencimiento: '2024-11-30', estado: 'vigente' },
            { id: 'd2-3', nombre: 'Carnet MATPEL', fechaVencimiento: '2024-12-15', estado: 'vigente' }
          ]
        },
        {
          id: 'p2-2',
          nombres: 'Luis Fernando',
          apellidos: 'Gutierrez Rojas',
          dni: '55667788',
          cargo: 'Operario MATPEL',
          estado: 'vencido',
          documentos: [
            { id: 'd2-4', nombre: 'SCTR Salud', fechaVencimiento: '2024-05-15', estado: 'vencido' },
            { id: 'd2-5', nombre: 'Carnet MATPEL', fechaVencimiento: '2024-04-30', estado: 'vencido' }
          ]
        }
      ],
      herramientas: [
        {
          id: 'h2-1',
          nombre: 'Bomba de Succión Industrial',
          codigo: 'BOM-001',
          marca: 'Grundfos',
          modelo: 'CR 32-2',
          estado: 'habilitado',
          documentos: [
            { id: 'hd2-1', nombre: 'Certificado de Operatividad', fechaVencimiento: '2024-10-15', estado: 'vigente' }
          ]
        }
      ],
      vehiculos: [
        {
          id: 'v2-1',
          placa: 'DEF-456',
          marca: 'Volvo',
          modelo: 'FMX',
          anio: 2020,
          tipo: 'Camión',
          estado: 'habilitado',
          documentos: [
            { id: 'vd2-1', nombre: 'SOAT', fechaVencimiento: '2024-12-01', estado: 'vigente' },
            { id: 'vd2-2', nombre: 'Permiso MATPEL', fechaVencimiento: '2024-11-15', estado: 'vigente' }
          ]
        }
      ],
      materialesPeligrosos: [
        {
          id: 'm1',
          nombre: 'Ácido Sulfúrico',
          codigoONU: '1830',
          clase: 'Clase 8 - Corrosivos',
          cantidad: 500,
          unidad: 'lt',
          estado: 'habilitado',
          documentos: [
            { id: 'md1', nombre: 'Hoja de Seguridad (MSDS)', fechaVencimiento: '2025-01-01', estado: 'vigente' }
          ]
        },
        {
          id: 'm2',
          nombre: 'Hidróxido de Sodio',
          codigoONU: '1823',
          clase: 'Clase 8 - Corrosivos',
          cantidad: 200,
          unidad: 'kg',
          estado: 'habilitado',
          documentos: [
            { id: 'md2', nombre: 'Hoja de Seguridad (MSDS)', fechaVencimiento: '2025-01-01', estado: 'vigente' }
          ]
        },
        {
          id: 'm3',
          nombre: 'Acetona',
          codigoONU: '1090',
          clase: 'Clase 3 - Líquidos Inflamables',
          cantidad: 100,
          unidad: 'lt',
          estado: 'vencido',
          documentos: [
            { id: 'md3', nombre: 'Hoja de Seguridad (MSDS)', fechaVencimiento: '2024-03-01', estado: 'vencido' }
          ]
        }
      ],
      documentos: [
        {
          id: 'de2-1',
          tipoDocumento: 'Póliza de Seguro',
          nombre: 'Seguro de Responsabilidad Ambiental',
          fechaEmision: '2024-01-01',
          fechaVencimiento: '2024-12-31',
          estado: 'vigente'
        },
        {
          id: 'de2-2',
          tipoDocumento: 'Licencia',
          nombre: 'Autorización de Transporte MATPEL',
          fechaEmision: '2024-02-01',
          fechaVencimiento: '2024-07-15',
          estado: 'por_vencer'
        }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.personalForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      cargo: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.herramientaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      marca: ['', [Validators.required, Validators.maxLength(50)]],
      modelo: ['', [Validators.maxLength(50)]]
    });

    this.vehiculoForm = this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{3}$/)]],
      marca: ['', [Validators.required, Validators.maxLength(50)]],
      modelo: ['', [Validators.required, Validators.maxLength(50)]],
      anio: ['', [Validators.required, Validators.min(1990), Validators.max(2030)]],
      tipo: ['', [Validators.required]]
    });

    this.materialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      codigoONU: ['', [Validators.required, Validators.maxLength(10)]],
      clase: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      unidad: ['', [Validators.required]]
    });

    this.documentoForm = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      fechaEmision: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contratoId = params['id'] || '1';
      this.cargarContrato();
    });
  }

  cargarContrato(): void {
    // Simular carga de contrato
    let contrato = this.contratosSimulados.find(c => c.id === this.contratoId);

    // Si no existe, usar el contrato con id '1' como base
    if (!contrato) {
      const base = this.contratosSimulados.find(c => c.id === '1');
      if (base) {
        contrato = { ...base, id: this.contratoId, numero: `OC-2024-00${this.contratoId}` };
      }
    }

    this.contrato = contrato || this.contratosSimulados[1]; // Index 1 es el contrato con datos
  }

  // Contadores para tabs
  getPersonalCount(): string {
    if (!this.contrato) return '0/0';
    const habilitados = this.contrato.personal.filter(p => p.estado === 'habilitado').length;
    return `${habilitados}/${this.contrato.personal.length}`;
  }

  getHerramientasCount(): string {
    if (!this.contrato) return '0/0';
    const habilitados = this.contrato.herramientas.filter(h => h.estado === 'habilitado').length;
    return `${habilitados}/${this.contrato.herramientas.length}`;
  }

  getVehiculosCount(): string {
    if (!this.contrato) return '0/0';
    const habilitados = this.contrato.vehiculos.filter(v => v.estado === 'habilitado').length;
    return `${habilitados}/${this.contrato.vehiculos.length}`;
  }

  getMaterialesCount(): string {
    if (!this.contrato) return '0/0';
    const habilitados = this.contrato.materialesPeligrosos.filter(m => m.estado === 'habilitado').length;
    return `${habilitados}/${this.contrato.materialesPeligrosos.length}`;
  }

  getDocumentosCount(): string {
    if (!this.contrato) return '0/0';
    const vigentes = this.contrato.documentos.filter(d => d.estado === 'vigente').length;
    return `${vigentes}/${this.contrato.documentos.length}`;
  }

  // Estados
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'habilitado':
      case 'vigente':
        return 'estado-habilitado';
      case 'por_vencer':
        return 'estado-por-vencer';
      case 'vencido':
        return 'estado-vencido';
      case 'pendiente':
        return 'estado-pendiente';
      default:
        return '';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'habilitado':
        return 'Habilitado';
      case 'vigente':
        return 'Vigente';
      case 'por_vencer':
        return 'Por Vencer';
      case 'vencido':
        return 'Vencido';
      case 'pendiente':
        return 'Pendiente';
      default:
        return estado;
    }
  }

  // Formularios
  abrirFormulario(tipo: 'personal' | 'herramienta' | 'vehiculo' | 'material' | 'documento', item?: any): void {
    this.formularioTipo = tipo;
    this.editandoId = item?.id || null;
    this.archivoSeleccionado = null;

    if (item) {
      switch (tipo) {
        case 'personal':
          this.personalForm.patchValue(item);
          break;
        case 'herramienta':
          this.herramientaForm.patchValue(item);
          break;
        case 'vehiculo':
          this.vehiculoForm.patchValue(item);
          break;
        case 'material':
          this.materialForm.patchValue(item);
          break;
        case 'documento':
          this.documentoForm.patchValue(item);
          break;
      }
    } else {
      this.resetFormularios();
    }

    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.editandoId = null;
    this.archivoSeleccionado = null;
    this.resetFormularios();
  }

  resetFormularios(): void {
    this.personalForm.reset();
    this.herramientaForm.reset();
    this.vehiculoForm.reset();
    this.materialForm.reset();
    this.documentoForm.reset();
  }

  onArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  guardar(): void {
    let form: FormGroup;

    switch (this.formularioTipo) {
      case 'personal':
        form = this.personalForm;
        break;
      case 'herramienta':
        form = this.herramientaForm;
        break;
      case 'vehiculo':
        form = this.vehiculoForm;
        break;
      case 'material':
        form = this.materialForm;
        break;
      case 'documento':
        form = this.documentoForm;
        break;
    }

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    // Simular guardado
    const mensaje = this.editandoId ? 'Registro actualizado correctamente' : 'Registro agregado correctamente';
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
    this.cerrarFormulario();
  }

  eliminar(tipo: string, id: string): void {
    // Simular eliminación
    this.snackBar.open('Registro eliminado correctamente', 'Cerrar', { duration: 3000 });
  }

  verDocumentos(item: any): void {
    // TODO: Abrir dialog con documentos del item
    console.log('Ver documentos de:', item);
  }

  volver(): void {
    this.router.navigate(['/dashboard-contratista']);
  }

  getTiposVehiculo(): string[] {
    return ['Camioneta', 'Furgoneta', 'Camión', 'Bus', 'Moto', 'Otro'];
  }

  getClasesMaterial(): string[] {
    return [
      'Clase 1 - Explosivos',
      'Clase 2 - Gases',
      'Clase 3 - Líquidos Inflamables',
      'Clase 4 - Sólidos Inflamables',
      'Clase 5 - Oxidantes',
      'Clase 6 - Tóxicos',
      'Clase 7 - Radiactivos',
      'Clase 8 - Corrosivos',
      'Clase 9 - Misceláneos'
    ];
  }

  getTiposDocumento(): string[] {
    return [
      'Póliza de Seguro',
      'Certificación',
      'Licencia',
      'Contrato',
      'Carta Fianza',
      'Constancia',
      'Otro'
    ];
  }
}
