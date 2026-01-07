import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmpresasService } from '../../core/services/empresas';
import { Empresa } from '../../core/models/empresa.model';
import { EmpresaDialogComponent } from './empresa-dialog/empresa-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { FileUploadService } from '../../core/services/file-upload.service';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './empresas.html',
  styleUrl: './empresas.scss'
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['razonSocial', 'ruc', 'tipo', 'estado', 'acciones'];

  // Filtro por tenant (para vista de contratistas de una empresa principal)
  tenantFilter: string | null = null;
  empresaPrincipalNombre: string = '';

  constructor(
    private empresasService: EmpresasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    // Verificar si hay filtro por tenant en query params
    this.route.queryParams.subscribe(params => {
      this.tenantFilter = params['tenant'] || null;
      if (this.tenantFilter) {
        // Si hay tenant, estamos viendo contratistas de una empresa principal específica
        this.empresaPrincipalNombre = this.tenantFilter;
      }
      this.loadEmpresas();
    });
  }

  loadEmpresas(): void {

      const filtro = this.tenantFilter || undefined;

      console.log('Cargando empresas con filtro:', filtro);

      this.empresasService.getEmpresas(filtro).subscribe({
        next: (data: Empresa[]) => {

          if (data.length > 0) {
            console.log('Estructura de datos recibida:', data[0]);
          }

          if (this.tenantFilter) {
            // Filtrar solo contratistas (excluir empresas principales)
            this.empresas = data.filter(e => {
              // Si tipo es un objeto, verificar su nombre o código
              if (e.tipo && typeof e.tipo === 'object') {
                const tipoNombre = e.tipo.nombre?.toLowerCase() || '';
                const tipoCodigo = e.tipo.codigo?.toString() || '';
                return tipoNombre !== 'empresa principal' &&
                       tipoNombre !== 'host' &&
                       tipoCodigo !== 'HOST';
              }
              return true; // Si no tiene tipo definido, incluirlo
            });
          } else {
            this.empresas = data;
          }

          this.empresasFiltradas = this.empresas;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error al cargar empresas:', error);
          this.showMessage('Error al cargar empresas', 'error');
        }
      });
    }

  filterEmpresas(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.empresasFiltradas = this.empresas;
      return;
    }

    this.empresasFiltradas = this.empresas.filter(empresa =>
      empresa.razonSocial.toLowerCase().includes(term) ||
      empresa.ruc.includes(term)
    );
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '500px',
      data: { tenantId: this.tenantFilter }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si hay un archivo seleccionado, subirlo primero
        if (result.logoFile) {
          this.uploadLogoAndCreate(result);
        } else {
          this.empresasService.createEmpresa(result).subscribe({
            next: () => {
              this.showMessage('Empresa creada exitosamente');
              this.searchTerm = '';
              this.loadEmpresas();
            },
            error: () => {
              this.showMessage('Error al crear empresa', 'error');
            }
          });
        }
      }
    });
  }

  openEditDialog(empresa: Empresa): void {
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '500px',
      data: { empresa }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si hay un archivo seleccionado, subirlo primero
        if (result.logoFile) {
          this.uploadLogoAndUpdate(empresa, result);
        } else {
          this.empresasService.updateEmpresa(empresa.empresaId, result).subscribe({
            next: () => {
              this.showMessage('Empresa actualizada exitosamente');
              this.searchTerm = '';
              this.loadEmpresas();
            },
            error: () => {
              this.showMessage('Error al actualizar empresa', 'error');
            }
          });
        }
      }
    });
  }

  deleteEmpresa(empresa: Empresa): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Está seguro de eliminar la empresa "${empresa.razonSocial}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.empresasService.deleteEmpresa(empresa.empresaId).subscribe({
          next: () => {
            this.showMessage('Empresa eliminada exitosamente');
            this.searchTerm = '';
            this.loadEmpresas();
          },
          error: () => {
            this.showMessage('Error al eliminar empresa', 'error');
          }
        });
      }
    });
  }

  verDetalle(empresa: Empresa): void {
    this.router.navigate(['/empresas', empresa.empresaId]);
  }

  verPersonal(empresa: Empresa): void {
    this.router.navigate(['/empresas', empresa.empresaId, 'personal']);
  }

  // Método para obtener el título de la página
  getPageTitle(): string {
    if (this.tenantFilter) {
      return `Contratistas de ${this.empresaPrincipalNombre}`;
    }
    return 'Gestión de Empresas';
  }

  // Método para obtener el texto del botón nuevo
  getNewButtonText(): string {
    if (this.tenantFilter) {
      return 'Nuevo Contratista';
    }
    return 'Nueva Empresa';
  }

  // Método para obtener el placeholder de búsqueda
  getSearchPlaceholder(): string {
    if (this.tenantFilter) {
      return 'Buscar contratista por razón social o RUC...';
    }
    return 'Razón social o RUC...';
  }

  // Método para obtener el mensaje de no resultados
  getNoResultsMessage(): string {
    if (this.tenantFilter) {
      return 'No se encontraron contratistas';
    }
    return 'No se encontraron empresas';
  }

  // Método para volver a empresas principales
  volverAEmpresasPrincipales(): void {
    this.router.navigate(['/empresa-principal']);
  }

  private showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  verActivos(empresa: Empresa): void {
    this.router.navigate(['/empresas', empresa.empresaId, 'activos']);
  }

  verMaterialesPeligrosos(empresa: Empresa): void {
    this.router.navigate(['/empresas', empresa.empresaId, 'materiales-peligrosos']);
  }

  uploadLogoAndCreate(data: any): void {
    this.fileUploadService.uploadLogo(data.logoFile).subscribe({
      next: (uploadResponse) => {
        console.log('Logo subido:', uploadResponse.url);
        // Actualizar datos con la URL del logo
        data.logoUrl = uploadResponse.url;
        delete data.logoFile;

        this.empresasService.createEmpresa(data).subscribe({
          next: () => {
            this.showMessage('Empresa creada exitosamente');
            this.searchTerm = '';
            this.loadEmpresas();
          },
          error: () => {
            this.showMessage('Error al crear empresa', 'error');
          }
        });
      },
      error: (error) => {
        console.error('Error al subir logo:', error);
        this.showMessage('Error al subir el logo', 'error');
      }
    });
  }

  uploadLogoAndUpdate(empresa: Empresa, data: any): void {
    this.fileUploadService.uploadLogo(data.logoFile).subscribe({
      next: (uploadResponse) => {
        console.log('Logo subido:', uploadResponse.url);
        // Actualizar datos con la URL del logo
        data.logoUrl = uploadResponse.url;
        delete data.logoFile;

        this.empresasService.updateEmpresa(empresa.empresaId, data).subscribe({
          next: () => {
            this.showMessage('Empresa actualizada exitosamente');
            this.searchTerm = '';
            this.loadEmpresas();
          },
          error: () => {
            this.showMessage('Error al actualizar empresa', 'error');
          }
        });
      },
      error: (error) => {
        console.error('Error al subir logo:', error);
        this.showMessage('Error al subir el logo', 'error');
      }
    });
  }
}