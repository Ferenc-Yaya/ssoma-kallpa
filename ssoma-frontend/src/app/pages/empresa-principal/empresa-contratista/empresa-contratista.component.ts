import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmpresaService, EmpresaDTO, CreateEmpresaRequest, UpdateEmpresaRequest } from '../../../core/services/empresa.service';
import { TiposContratistaService } from '../../../core/services/tipos-contratista.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { EmpresaDialogComponent } from '../empresa-dialog/empresa-dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-empresa-contratista',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './empresa-contratista.component.html',
  styleUrls: ['./empresa-contratista.component.scss']
})
export class EmpresaContratistaComponent implements OnInit {
  tenantId: string = '';
  empresaPrincipalNombre: string = '';
  contratistas: EmpresaDTO[] = [];
  displayedColumns: string[] = ['razonSocial', 'ruc', 'tipoNombre', 'activo', 'acciones'];
  loading = true;
  tipoContratistaId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private tiposContratistaService: TiposContratistaService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).subscribe(([params, queryParams]) => {
      this.tenantId = params.get('tenantId') || '';
      const nombreFromParams = queryParams.get('nombre') || this.tenantId;
      this.empresaPrincipalNombre = decodeURIComponent(nombreFromParams);
      if (this.tenantId) {
        this.loading = true; // Iniciar carga aquí
        this.loadTipoContratista();
      }
    });
  }

  loadTipoContratista(): void {
    this.tiposContratistaService.getAll().subscribe({
      next: (tipos) => {
        const tipoContratista = tipos.find(t =>
          t.nombre === 'Contratista' || t.codigo === 'CONTRATISTA'
        );
        if (tipoContratista) {
          this.tipoContratistaId = tipoContratista.tipoId;
          this.loadContratistas();
        } else {
          this.showNotification('Error: No se encontró el tipo "Contratista"', 'error');
          setTimeout(() => this.loading = false, 0);
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de contratista:', error);
        this.showNotification('Error al cargar tipos de contratista', 'error');
        setTimeout(() => this.loading = false, 0);
      }
    });
  }

  loadContratistas(): void {
    this.empresaService.getAllEmpresas().subscribe({
      next: (empresas) => {
        this.contratistas = empresas.filter(
          e => e.tenantId === this.tenantId && e.tipoNombre !== 'Empresa Principal'
        );
        setTimeout(() => this.loading = false, 0);
      },
      error: (error) => {
        console.error('Error al cargar contratistas:', error);
        setTimeout(() => this.loading = false, 0);
        this.showNotification('Error al cargar contratistas', 'error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/empresa-principal']);
  }

  openCreateContratistaDialog(): void {
    if (!this.tipoContratistaId) {
      this.showNotification('Error: No se pudo determinar el tipo de contratista', 'error');
      return;
    }

    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '650px',
      data: {
        isEdit: false,
        tenantId: this.tenantId, // Asociar al tenant principal
        tipoId: this.tipoContratistaId // Forzar tipo Contratista
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
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '650px',
      data: {
        empresa: empresa, // Pasar la empresa existente
        isEdit: true,
        tenantId: this.tenantId, // Asegurar que el tenantId se mantiene
        tipoId: this.tipoContratistaId // Asegurar que el tipo es Contratista
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
      tenantId: this.tenantId, // Asociar al tenant principal
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      tipoId: this.tipoContratistaId!, // Usar el tipo Contratista
      direccion: data.direccion || null,
      telefono: data.telefono || null,
      email: data.email || null,
      logoUrl: data.logoUrl || null,
      sitioWeb: data.sitioWeb || null,
      rubroComercial: data.rubroComercial || null,
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
      tipoId: this.tipoContratistaId!, // Asegurar que el tipo es Contratista
      direccion: data.direccion || null,
      telefono: data.telefono || null,
      email: data.email || null,
      logoUrl: data.logoUrl || null,
      sitioWeb: data.sitioWeb || null,
      rubroComercial: data.rubroComercial || null,
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

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
