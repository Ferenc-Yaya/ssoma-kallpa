import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RolDialogComponent } from './rol-dialog/rol-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { RolesService, Rol } from '../../core/services/roles.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class RolesComponent implements OnInit {
  roles: Rol[] = [];
  displayedColumns: string[] = ['nombre', 'codigo', 'descripcion', 'nivelJerarquia', 'requiereTenant', 'usuarios', 'activo', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private rolesService: RolesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles.sort((a, b) => a.nivelJerarquia - b.nivelJerarquia);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando roles:', error);
        this.showNotification('Error al cargar los roles', 'error');
      }
    });
  }

  getNivelLabel(nivel: number): string {
    switch (nivel) {
      case 1: return 'Nivel 1 - Sistema';
      case 2: return 'Nivel 2 - Empresa';
      case 3: return 'Nivel 3 - Contratista';
      case 4: return 'Nivel 4 - Usuario';
      default: return `Nivel ${nivel}`;
    }
  }

  getNivelColor(nivel: number): string {
    switch (nivel) {
      case 1: return 'chip-nivel-1';
      case 2: return 'chip-nivel-2';
      case 3: return 'chip-nivel-3';
      case 4: return 'chip-nivel-4';
      default: return '';
    }
  }

  openRolDialog(rol?: Rol): void {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '650px',
      data: {
        rol: rol,
        isEdit: !!rol
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (rol) {
          this.updateRol(rol, result);
        } else {
          this.createRol(result);
        }
      }
    });
  }

  createRol(data: any): void {
    const request = {
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      nivelJerarquia: data.nivelJerarquia,
      requiereTenant: data.requiereTenant,
      activo: data.activo
    };

    this.rolesService.createRol(request).subscribe({
      next: () => {
        this.loadRoles();
        this.showNotification('Rol creado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error creando rol:', error);
        const errorMsg = error.error?.message || 'Error al crear el rol';
        this.showNotification(errorMsg, 'error');
      }
    });
  }

  updateRol(rol: Rol, data: any): void {
    const request = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      nivelJerarquia: data.nivelJerarquia,
      requiereTenant: data.requiereTenant,
      activo: data.activo
    };

    this.rolesService.updateRol(rol.rolId, request).subscribe({
      next: () => {
        this.loadRoles();
        this.showNotification('Rol actualizado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error actualizando rol:', error);
        const errorMsg = error.error?.message || 'Error al actualizar el rol';
        this.showNotification(errorMsg, 'error');
      }
    });
  }

  deleteRol(rol: Rol): void {
    if (rol.cantidadUsuarios > 0) {
      this.showNotification(`No se puede eliminar el rol "${rol.nombre}" porque tiene ${rol.cantidadUsuarios} usuario(s) asignado(s)`, 'error');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Eliminar Rol',
        message: `¿Está seguro de eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rolesService.deleteRol(rol.rolId).subscribe({
          next: () => {
            this.loadRoles();
            this.showNotification('Rol eliminado exitosamente', 'success');
          },
          error: (error) => {
            console.error('Error eliminando rol:', error);
            const errorMsg = error.error?.message || 'Error al eliminar el rol';
            this.showNotification(errorMsg, 'error');
          }
        });
      }
    });
  }

  toggleEstadoRol(rol: Rol): void {
    if (rol.cantidadUsuarios > 0 && rol.activo) {
      this.showNotification(`No se puede desactivar el rol "${rol.nombre}" porque tiene usuarios asignados`, 'error');
      return;
    }

    this.rolesService.toggleActivo(rol.rolId).subscribe({
      next: () => {
        const accion = !rol.activo ? 'activado' : 'desactivado';
        this.loadRoles();
        this.showNotification(`Rol ${accion} exitosamente`, 'success');
      },
      error: (error) => {
        console.error('Error cambiando estado del rol:', error);
        const errorMsg = error.error?.message || 'Error al cambiar el estado del rol';
        this.showNotification(errorMsg, 'error');
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
