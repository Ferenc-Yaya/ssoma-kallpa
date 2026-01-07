import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { EmpresaService, EmpresaDTO } from '../../core/services/empresa.service';
import { SedeService, SedeDTO } from '../../core/services/sede.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { TiposContratistaService } from '../../core/services/tipos-contratista.service';
import { EmpresaDialogComponent } from './empresa-dialog/empresa-dialog';
import { SedeDialogComponent } from './sede-dialog/sede-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface EmpresaPrincipal {
  empresaId: string;
  tenantId: string;
  ruc: string;
  razonSocial: string;
  tipo: string;
  direccion: string;
  telefono: string;
  email: string;
  logoUrl: string;
  sitioWeb: string;
  rubroComercial: string;
  scoreSeguridad: number;
  estadoHabilitacion: string;
  activo: boolean;
  cantidadSedes: number;
  createdAt: string;
  sedes?: Sede[];
}

interface Sede {
  sedeId: string;
  nombre: string;
  direccion: string;
  esPrincipal: boolean;
  activo: boolean;
}

@Component({
  selector: 'app-empresa-principal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './empresa-principal.html',
  styleUrl: './empresa-principal.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EmpresaPrincipalComponent implements OnInit {
  empresasPrincipales: EmpresaPrincipal[] = [];
  displayedColumns: string[] = ['tenantId', 'razonSocial', 'ruc', 'cantidadSedes', 'estadoHabilitacion', 'acciones'];
  displayedColumnsSedes: string[] = ['nombre', 'direccion', 'esPrincipal', 'activo', 'acciones'];
  expandedEmpresa: EmpresaPrincipal | null = null;
  loading: boolean = false;
  tipoHostId: string | null = null; // ID del tipo 'HOST' para crear nuevas empresas principales

  constructor(
    private authService: AuthService,
    private empresaService: EmpresaService,
    private sedeService: SedeService,
    private fileUploadService: FileUploadService,
    private tiposContratistaService: TiposContratistaService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTipoContratista();
    this.loadEmpresasPrincipales();
  }

  loadTipoContratista(): void {
    // Cargar tipos de contratista para obtener el ID del tipo "Empresa Principal"
    this.tiposContratistaService.getAll().subscribe({
      next: (tipos) => {
        const tipoHost = tipos.find(t =>
          t.nombre === 'Empresa Principal' || t.codigo === 'HOST'
        );
        if (tipoHost) {
          this.tipoHostId = tipoHost.tipoId;
          console.log('✅ Tipo HOST encontrado:', this.tipoHostId);
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de contratista:', error);
      }
    });
  }

  loadEmpresasPrincipales(): void {
    console.log('🔄 Iniciando carga de empresas principales...');
    console.log('🔑 Token:', localStorage.getItem('auth_token')?.substring(0, 50) + '...');
    console.log('🏢 Tenant:', localStorage.getItem('current_tenant'));

    this.loading = true;
    this.cdr.detectChanges(); // Forzar detección de cambios después de cambiar loading
    this.empresaService.getAllEmpresas().subscribe({
      next: (empresas: EmpresaDTO[]) => {
        try {
          console.log('📦 Empresas recibidas del backend:', empresas);

          // Filtrar solo empresas principales (tipoNombre='Empresa Principal')
          const empresasPrincipales = empresas.filter(e =>
            e.tipoNombre === 'Empresa Principal'
          );

          console.log('✅ Empresas principales filtradas:', empresasPrincipales);

          // Mapear a la interfaz local
          this.empresasPrincipales = empresasPrincipales.map(e => ({
            empresaId: e.id,
            tenantId: e.tenantId,
            ruc: e.ruc,
            razonSocial: e.razonSocial,
            tipo: e.tipoNombre,
            direccion: e.direccion || '',
            telefono: e.telefono || '',
            email: e.email || '',
            logoUrl: e.logoUrl || '',
            sitioWeb: e.sitioWeb || '',
            rubroComercial: e.rubroComercial || '',
            scoreSeguridad: e.scoreSeguridad || 100,
            estadoHabilitacion: 'ACTIVO',
            activo: e.activo,
            cantidadSedes: 0,
            createdAt: e.createdAt || '',
            sedes: []
          }));

          console.log('✅ Empresas mapeadas:', this.empresasPrincipales);

          // Cargar sedes para cada empresa
          this.empresasPrincipales.forEach(empresa => {
            this.loadSedesForEmpresa(empresa);
          });

          this.loading = false;
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error en el procesamiento:', error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar empresas principales:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error completo:', JSON.stringify(error, null, 2));
        this.showNotification('Error al cargar empresas principales', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSedesForEmpresa(empresa: EmpresaPrincipal): void {
    this.sedeService.getSedesByEmpresa(empresa.empresaId).subscribe({
      next: (sedes: SedeDTO[]) => {
        empresa.sedes = sedes.map(s => ({
          sedeId: s.id,
          nombre: s.nombre,
          direccion: s.direccion,
          esPrincipal: s.esPrincipal,
          activo: s.activo
        }));
        empresa.cantidadSedes = sedes.length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar sedes para empresa:', empresa.empresaId, error);
        empresa.cantidadSedes = 0;
        empresa.sedes = [];
      }
    });
  }

  toggleEmpresa(empresa: EmpresaPrincipal): void {
    this.expandedEmpresa = this.expandedEmpresa === empresa ? null : empresa;
  }

  openEmpresaDialog(empresa?: EmpresaPrincipal): void {
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '650px',
      data: {
        empresa: empresa,
        isEdit: !!empresa
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si hay un archivo seleccionado, subirlo primero
        if (result.logoFile) {
          this.uploadLogoAndSave(empresa, result);
        } else {
          if (empresa) {
            this.updateEmpresa(empresa, result);
          } else {
            this.createEmpresa(result);
          }
        }
      }
    });
  }

  uploadLogoAndSave(empresa: EmpresaPrincipal | undefined, data: any): void {
    this.fileUploadService.uploadLogo(data.logoFile).subscribe({
      next: (uploadResponse) => {
        console.log('Logo subido:', uploadResponse.url);
        // Actualizar datos con la URL del logo
        data.logoUrl = uploadResponse.url;
        delete data.logoFile;

        if (empresa) {
          this.updateEmpresa(empresa, data);
        } else {
          this.createEmpresa(data);
        }
      },
      error: (error) => {
        console.error('Error al subir logo:', error);
        this.showNotification('Error al subir el logo', 'error');
      }
    });
  }

  createEmpresa(data: any): void {
    // Validar que tengamos el tipoId de HOST
    if (!this.tipoHostId) {
      this.showNotification('Error: No se pudo determinar el tipo de empresa principal', 'error');
      return;
    }

    // Agregar tipoId de HOST y tenantId al request
    const request = {
      tenantId: data.tenantId, // Incluir tenantId generado en el diálogo
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      tipoId: this.tipoHostId,
      direccion: data.direccion || null,
      telefono: data.telefono || null,
      email: data.email || null,
      logoUrl: data.logoUrl || null,
      sitioWeb: data.sitioWeb || null,
      rubroComercial: data.rubroComercial || null,
      activo: data.activo !== undefined ? data.activo : true
    };

    console.log('Creando empresa con datos:', request);

    this.empresaService.createEmpresa(request).subscribe({
      next: (empresa: EmpresaDTO) => {
        this.showNotification('Empresa principal creada exitosamente', 'success');
        this.loadEmpresasPrincipales(); // Recargar lista
      },
      error: (error) => {
        console.error('Error al crear empresa:', error);
        const errorMsg = error?.error?.message || 'Error al crear empresa principal';
        this.showNotification(errorMsg, 'error');
      }
    });
  }

  updateEmpresa(empresa: EmpresaPrincipal, data: any): void {
    this.empresaService.updateEmpresa(empresa.empresaId, data).subscribe({
      next: (empresaActualizada: EmpresaDTO) => {
        this.showNotification('Empresa principal actualizada exitosamente', 'success');
        this.loadEmpresasPrincipales(); // Recargar lista
      },
      error: (error) => {
        console.error('Error al actualizar empresa:', error);
        this.showNotification('Error al actualizar empresa principal', 'error');
      }
    });
  }

  deleteEmpresa(empresa: EmpresaPrincipal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Eliminar Empresa Principal',
        message: `¿Está seguro de eliminar la empresa "${empresa.razonSocial}" (${empresa.tenantId})? Esta acción no se puede deshacer y se eliminarán todas las sedes asociadas.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.empresaService.deleteEmpresa(empresa.empresaId).subscribe({
          next: () => {
            this.showNotification('Empresa principal eliminada exitosamente', 'success');
            this.loadEmpresasPrincipales(); // Recargar lista
          },
          error: (error) => {
            console.error('Error al eliminar empresa:', error);
            this.showNotification('Error al eliminar empresa principal', 'error');
          }
        });
      }
    });
  }

  toggleEstadoEmpresa(empresa: EmpresaPrincipal): void {
    const nuevoEstado = !empresa.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: `${nuevoEstado ? 'Activar' : 'Desactivar'} Empresa`,
        message: `¿Está seguro de ${accion} la empresa "${empresa.razonSocial}"?`,
        confirmText: nuevoEstado ? 'Activar' : 'Desactivar',
        cancelText: 'Cancelar',
        confirmColor: nuevoEstado ? 'primary' : 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.empresaService.toggleEstado(empresa.empresaId, nuevoEstado).subscribe({
          next: () => {
            this.showNotification(
              `Empresa ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente`,
              'success'
            );
            this.loadEmpresasPrincipales();
          },
          error: (error) => {
            console.error('Error al cambiar estado:', error);
            this.showNotification('Error al cambiar el estado de la empresa', 'error');
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard-superadmin']); // O a la ruta principal que corresponda
  }

  viewEmpresaDetail(empresa: EmpresaPrincipal): void {
    this.router.navigate(['/empresa-principal/contratista', empresa.tenantId], {
      queryParams: { nombre: empresa.razonSocial }
    });
  }

  openUsuariosDialog(empresa: EmpresaPrincipal): void {
    this.router.navigate(['/empresa-usuarios'], {
      queryParams: {
        tenant: empresa.tenantId,
        nombre: empresa.razonSocial
      }
    });
  }

  openSedeDialog(empresa: EmpresaPrincipal, sede?: Sede): void {
    const dialogRef = this.dialog.open(SedeDialogComponent, {
      width: '600px',
      data: {
        sede: sede,
        isEdit: !!sede,
        empresaNombre: empresa.razonSocial
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (sede) {
          // Editar sede existente
          this.updateSede(empresa, sede, result);
        } else {
          // Crear nueva sede
          this.createSede(empresa, result);
        }
      }
    });
  }

  createSede(empresa: EmpresaPrincipal, data: any): void {
    const request = {
      empresaId: empresa.empresaId,
      nombre: data.nombre,
      direccion: data.direccion,
      esPrincipal: data.esPrincipal,
      activo: data.activo
    };

    this.sedeService.createSede(request).subscribe({
      next: (sede) => {
        this.showNotification('Sede creada exitosamente', 'success');
        // Recargar sedes de esta empresa
        this.loadSedesForEmpresa(empresa);
      },
      error: (error) => {
        console.error('Error al crear sede:', error);
        this.showNotification('Error al crear sede', 'error');
      }
    });
  }

  updateSede(empresa: EmpresaPrincipal, sede: Sede, data: any): void {
    const request = {
      nombre: data.nombre,
      direccion: data.direccion,
      esPrincipal: data.esPrincipal,
      activo: data.activo
    };

    this.sedeService.updateSede(sede.sedeId, request).subscribe({
      next: (sedeActualizada) => {
        this.showNotification('Sede actualizada exitosamente', 'success');
        // Recargar sedes de esta empresa
        this.loadSedesForEmpresa(empresa);
      },
      error: (error) => {
        console.error('Error al actualizar sede:', error);
        this.showNotification('Error al actualizar sede', 'error');
      }
    });
  }

  deleteSede(empresa: EmpresaPrincipal, sede: Sede): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Eliminar Sede',
        message: `¿Está seguro de eliminar la sede "${sede.nombre}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.sedeService.deleteSede(sede.sedeId).subscribe({
          next: () => {
            this.showNotification('Sede eliminada exitosamente', 'success');
            // Recargar sedes de esta empresa
            this.loadSedesForEmpresa(empresa);
          },
          error: (error) => {
            console.error('Error al eliminar sede:', error);
            this.showNotification('Error al eliminar sede', 'error');
          }
        });
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
