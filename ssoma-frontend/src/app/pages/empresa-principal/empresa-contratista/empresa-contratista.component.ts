import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpresaService, EmpresaDTO, CreateEmpresaRequest, UpdateEmpresaRequest } from '../../../core/services/empresa.service';
import { TiposContratistaService } from '../../../core/services/tipos-contratista.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { ContratistaDialogComponent } from '../contratista-dialog/contratista-dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-empresa-contratista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './empresa-contratista.component.html',
  styleUrls: ['./empresa-contratista.component.scss']
})
export class EmpresaContratistaComponent implements OnInit {
  tenantId: string = '';
  empresaPrincipalNombre: string = '';
  contratistas: EmpresaDTO[] = [];
  contratistasFiltrados: EmpresaDTO[] = [];
  displayedColumns: string[] = ['logo', 'razonSocial', 'ruc', 'tipoNombre', 'activo', 'acciones'];
  loading = true;
  tipoContratistaId: string | null = null;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private tiposContratistaService: TiposContratistaService,
    private fileUploadService: FileUploadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚀 [CONTRATISTAS] Componente inicializado');
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).subscribe(([params, queryParams]) => {
      this.tenantId = params.get('tenantId') || '';
      const nombreFromParams = queryParams.get('nombre') || this.tenantId;
      this.empresaPrincipalNombre = decodeURIComponent(nombreFromParams);
      console.log('📋 [CONTRATISTAS] TenantId obtenido de la ruta:', this.tenantId);
      console.log('📋 [CONTRATISTAS] Nombre empresa:', this.empresaPrincipalNombre);
      if (this.tenantId) {
        this.loading = true;
        this.loadTipoContratista(); // Solo para obtener tipos disponibles
        this.loadContratistas(); // Cargar contratistas directamente
      } else {
        console.error('❌ [CONTRATISTAS] No se obtuvo tenantId de la ruta');
      }
    });
  }

  loadTipoContratista(): void {
    console.log('🔍 [CONTRATISTAS] Cargando tipos de contratista...');
    this.tiposContratistaService.getAll().subscribe({
      next: (tipos) => {
        console.log('📦 [CONTRATISTAS] Tipos recibidos:', tipos);
        // Buscar el primer tipo que NO sea "Empresa Principal"
        // Puede ser EVENTUAL, PERMANENTE o VISITA
        const tipoContratista = tipos.find(t => t.codigo !== 'HOST');
        if (tipoContratista) {
          this.tipoContratistaId = tipoContratista.tipoId;
          console.log('✅ [CONTRATISTAS] Tipo por defecto para nuevos contratistas:', tipoContratista.nombre, tipoContratista.tipoId);
        } else {
          console.warn('⚠️ [CONTRATISTAS] No se encontró ningún tipo disponible para contratistas');
        }
      },
      error: (error) => {
        console.error('❌ [CONTRATISTAS] Error al cargar tipos:', error);
      }
    });
  }

  loadContratistas(): void {
    console.log('🔎 [CONTRATISTAS] Iniciando carga de contratistas...');
    console.log('🏢 [CONTRATISTAS] TenantId a buscar:', this.tenantId);
    this.empresaService.getAllEmpresas(this.tenantId).subscribe({
      next: (empresas) => {
        console.log('📦 [CONTRATISTAS] Todas las empresas recibidas del backend:', empresas);
        console.log('🏷️ [CONTRATISTAS] Cantidad de empresas:', empresas.length);

        // Ya no necesitamos filtrar por tenantId porque el backend lo hace
        this.contratistas = empresas.filter(
          e => e.tipoNombre !== 'Empresa Principal'
        );
        this.filtrarContratistas();

        console.log('✅ [CONTRATISTAS] Contratistas después de filtrar:', this.contratistas);
        console.log('📊 [CONTRATISTAS] Cantidad de contratistas:', this.contratistas.length);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ [CONTRATISTAS] Error al cargar contratistas:', error);
        this.loading = false;
        this.cdr.detectChanges();
        this.showNotification('Error al cargar contratistas', 'error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/empresa-principal']);
  }

  openCreateContratistaDialog(): void {
    const dialogRef = this.dialog.open(ContratistaDialogComponent, {
      width: '600px',
      maxHeight: '85vh',
      autoFocus: false,
      panelClass: 'contratista-dialog-panel',
      data: {
        isEdit: false,
        tenantId: this.tenantId,
        tipoId: this.tipoContratistaId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.logoFile) {
          this.uploadLogoAndSave(undefined, result, 'create');
        } else {
          this.createEmpresa(result);
        }
      }
    });
  }

  openEditContratistaDialog(empresa: EmpresaDTO): void {
    const dialogRef = this.dialog.open(ContratistaDialogComponent, {
      width: '600px',
      maxHeight: '85vh',
      autoFocus: false,
      panelClass: 'contratista-dialog-panel',
      data: {
        empresa: empresa,
        isEdit: true,
        tenantId: this.tenantId,
        tipoId: empresa.tipoId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.logoFile) {
          this.uploadLogoAndSave(empresa, result, 'update');
        } else {
          this.updateEmpresa(empresa, result);
        }
      }
    });
  }

  deleteContratista(empresa: EmpresaDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Eliminar Contratista',
        message: `¿Está seguro de eliminar al contratista "${empresa.razonSocial}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.empresaService.deleteEmpresa(empresa.id).subscribe({
          next: () => {
            this.showNotification('Contratista eliminado exitosamente', 'success');
            this.loadContratistas();
          },
          error: (error) => {
            console.error('Error al eliminar contratista:', error);
            this.showNotification('Error al eliminar contratista', 'error');
          }
        });
      }
    });
  }

  uploadLogoAndSave(empresa: EmpresaDTO | undefined, data: any, operation: 'create' | 'update'): void {
    this.fileUploadService.uploadLogo(data.logoFile).subscribe({
      next: (uploadResponse) => {
        data.logoUrl = uploadResponse.url;
        delete data.logoFile;

        if (operation === 'create') {
          this.createEmpresa(data);
        } else {
          this.updateEmpresa(empresa!, data);
        }
      },
      error: (error) => {
        console.error('Error al subir logo:', error);
        this.showNotification('Error al subir el logo', 'error');
      }
    });
  }

  createEmpresa(data: any): void {
    const request: CreateEmpresaRequest = {
      tenantId: this.tenantId,
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      tipoId: data.tipoId,
      direccion: data.direccion || null,
      telefono: data.telefono || null,
      email: data.email || null,
      logoUrl: data.logoUrl || null,
      sitioWeb: data.sitioWeb || null,
      rubroComercial: data.rubroComercial || null,
      scoreSeguridad: data.scoreSeguridad || 0,
      contactos: data.contactos || [],
      activo: data.activo !== undefined ? data.activo : true
    };

    this.empresaService.createEmpresa(request).subscribe({
      next: () => {
        this.showNotification('Contratista creado exitosamente', 'success');
        this.loadContratistas();
      },
      error: (error) => {
        console.error('Error al crear contratista:', error);
        this.showNotification(error?.error?.message || 'Error al crear contratista', 'error');
      }
    });
  }

  updateEmpresa(empresa: EmpresaDTO, data: any): void {
    const request: UpdateEmpresaRequest = {
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      tipoId: data.tipoId,
      direccion: data.direccion || null,
      telefono: data.telefono || null,
      email: data.email || null,
      logoUrl: data.logoUrl || null,
      sitioWeb: data.sitioWeb || null,
      rubroComercial: data.rubroComercial || null,
      scoreSeguridad: data.scoreSeguridad || 0,
      contactos: data.contactos || [],
      activo: data.activo !== undefined ? data.activo : true
    };

    this.empresaService.updateEmpresa(empresa.id, request).subscribe({
      next: () => {
        this.showNotification('Contratista actualizado exitosamente', 'success');
        this.loadContratistas();
      },
      error: (error) => {
        console.error('Error al actualizar contratista:', error);
        this.showNotification(error?.error?.message || 'Error al actualizar contratista', 'error');
      }
    });
  }

  filtrarContratistas(): void {
    if (!this.searchTerm.trim()) {
      this.contratistasFiltrados = [...this.contratistas];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.contratistasFiltrados = this.contratistas.filter(c =>
        c.razonSocial.toLowerCase().includes(term)
      );
    }
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.filtrarContratistas();
  }

  toggleEstado(empresa: EmpresaDTO): void {
    const nuevoEstado = !empresa.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    this.empresaService.toggleEstado(empresa.id, nuevoEstado).subscribe({
      next: () => {
        empresa.activo = nuevoEstado;
        this.showNotification(`Contratista ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`, 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(`Error al ${accion} contratista:`, error);
        this.showNotification(`Error al ${accion} contratista`, 'error');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
