import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmpresasService } from '../../core/services/empresas';
import { Empresa } from '../../mocks/empresas.mock';
import { EmpresaDialogComponent } from './empresa-dialog/empresa-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

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
  displayedColumns: string[] = ['id', 'razonSocial', 'ruc', 'tipo', 'estado', 'acciones'];

  constructor(
    private empresasService: EmpresasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.empresasService.getEmpresas().subscribe({
      next: (data: Empresa[]) => {
        this.empresas = data;
        this.empresasFiltradas = data;
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
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
    });
  }

  openEditDialog(empresa: Empresa): void {
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '500px',
      data: { empresa }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresasService.updateEmpresa(empresa.id, result).subscribe({
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
        this.empresasService.deleteEmpresa(empresa.id).subscribe({
          next: (success: boolean) => {
            if (success) {
              this.showMessage('Empresa eliminada exitosamente');
              this.searchTerm = '';
              this.loadEmpresas();
            } else {
              this.showMessage('No se pudo eliminar la empresa', 'error');
            }
          },
          error: () => {
            this.showMessage('Error al eliminar empresa', 'error');
          }
        });
      }
    });
  }

  verDetalle(empresa: Empresa): void {
    this.router.navigate(['/empresas', empresa.id]);
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