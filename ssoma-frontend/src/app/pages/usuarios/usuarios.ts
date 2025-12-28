import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { ChangePasswordDialogComponent } from '../../shared/change-password-dialog/change-password-dialog';
import { UsuariosService, Usuario } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['username', 'nombreCompleto', 'email', 'rol', 'tenant', 'activo', 'acciones'];

  // Filtros
  filtroRol: string = 'TODOS';
  filtroEstado: string = 'TODOS';

  roles = [
    { value: 'TODOS', label: 'Todos los roles' },
    { value: 'SUPER_ADMIN', label: 'Super Administrador' },
    { value: 'ADMIN_EMPRESA_PRINCIPAL', label: 'Admin Empresa Principal' },
    { value: 'ADMIN_CONTRATISTA', label: 'Admin Contratista' }
  ];

  estados = [
    { value: 'TODOS', label: 'Todos los estados' },
    { value: 'ACTIVO', label: 'Activos' },
    { value: 'INACTIVO', label: 'Inactivos' }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuariosService.getAllUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.map(u => ({
          ...u,
          rol: u.rolCodigo as 'SUPER_ADMIN' | 'ADMIN_EMPRESA_PRINCIPAL' | 'ADMIN_CONTRATISTA'
        }));
        this.aplicarFiltros();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.showNotification('Error al cargar los usuarios', 'error');
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.usuarios];

    // Filtro por búsqueda de texto
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      resultado = resultado.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.nombreCompleto.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    // Filtro por rol
    if (this.filtroRol !== 'TODOS') {
      resultado = resultado.filter(u => u.rol === this.filtroRol);
    }

    // Filtro por estado
    if (this.filtroEstado !== 'TODOS') {
      resultado = resultado.filter(u =>
        this.filtroEstado === 'ACTIVO' ? u.activo : !u.activo
      );
    }

    this.usuariosFiltrados = resultado;
  }

  getRolLabel(rol: string): string {
    const rolObj = this.roles.find(r => r.value === rol);
    return rolObj?.label || rol;
  }

  getRolColor(rol: string): string {
    switch (rol) {
      case 'SUPER_ADMIN':
        return 'chip-super-admin';
      case 'ADMIN_EMPRESA_PRINCIPAL':
        return 'chip-admin-empresa';
      case 'ADMIN_CONTRATISTA':
        return 'chip-admin-contratista';
      default:
        return '';
    }
  }

  openUsuarioDialog(usuario?: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '700px',
      data: {
        usuario: usuario,
        isEdit: !!usuario
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (usuario) {
          this.updateUsuario(usuario, result);
        } else {
          this.createUsuario(result);
        }
      }
    });
  }

  createUsuario(data: any): void {
    const request = {
      username: data.username,
      password: data.password,
      nombreCompleto: data.nombreCompleto,
      email: data.email,
      rolId: data.rolId,
      tenantId: data.tenantId,
      empresaNombre: data.empresaNombre,
      activo: data.activo
    };

    this.usuariosService.createUsuario(request).subscribe({
      next: (usuario) => {
        this.loadUsuarios();
        this.showNotification('Usuario creado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error creando usuario:', error);
        const errorMsg = error.error?.message || 'Error al crear el usuario';
        this.showNotification(errorMsg, 'error');
      }
    });
  }

  updateUsuario(usuario: Usuario, data: any): void {
    const request = {
      nombreCompleto: data.nombreCompleto,
      email: data.email,
      rolId: data.rolId,
      tenantId: data.tenantId,
      empresaNombre: data.empresaNombre,
      activo: data.activo
    };

    this.usuariosService.updateUsuario(usuario.usuarioId, request).subscribe({
      next: () => {
        this.loadUsuarios();
        this.showNotification('Usuario actualizado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error actualizando usuario:', error);
        const errorMsg = error.error?.message || 'Error al actualizar el usuario';
        this.showNotification(errorMsg, 'error');
      }
    });
  }

  deleteUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Está seguro de eliminar al usuario "${usuario.username}" (${usuario.nombreCompleto})? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.usuariosService.deleteUsuario(usuario.usuarioId).subscribe({
          next: () => {
            this.loadUsuarios();
            this.showNotification('Usuario eliminado exitosamente', 'success');
          },
          error: (error) => {
            console.error('Error eliminando usuario:', error);
            const errorMsg = error.error?.message || 'Error al eliminar el usuario';
            this.showNotification(errorMsg, 'error');
          }
        });
      }
    });
  }

  toggleEstadoUsuario(usuario: Usuario): void {
    this.usuariosService.toggleActivo(usuario.usuarioId).subscribe({
      next: () => {
        const accion = !usuario.activo ? 'activado' : 'desactivado';
        this.loadUsuarios();
        this.showNotification(`Usuario ${accion} exitosamente`, 'success');
      },
      error: (error) => {
        console.error('Error cambiando estado del usuario:', error);
        const errorMsg = error.error?.message || 'Error al cambiar el estado del usuario';
        this.showNotification(errorMsg, 'error');
      }
    });
  }

  resetPassword(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '600px',
      data: {
        username: usuario.username,
        nombreCompleto: usuario.nombreCompleto
      }
    });

    dialogRef.afterClosed().subscribe(newPassword => {
      if (newPassword) {
        this.usuariosService.changePassword(usuario.usuarioId, { newPassword }).subscribe({
          next: () => {
            this.showNotification(`Contraseña cambiada exitosamente para ${usuario.username}`, 'success');
          },
          error: (error) => {
            console.error('Error cambiando contraseña:', error);
            const errorMsg = error.error?.message || 'Error al cambiar la contraseña';
            this.showNotification(errorMsg, 'error');
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
