import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuariosService, Usuario, CreateUsuarioRequest } from '../../core/services/usuarios.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { UsuarioEmpresaDialogComponent } from './usuario-empresa-dialog/usuario-empresa-dialog';

@Component({
  selector: 'app-empresa-usuarios',
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
  templateUrl: './empresa-usuarios.html',
  styleUrl: './empresa-usuarios.scss'
})
export class EmpresaUsuariosComponent implements OnInit {
  tenantId: string = '';
  tenantName: string = '';
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['username', 'nombreCompleto', 'email', 'rol', 'activo', 'acciones'];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tenantId = params['tenant'] || '';
      this.tenantName = params['nombre'] || this.tenantId;
      if (this.tenantId) {
        this.loadUsuarios();
      }
    });
  }

  loadUsuarios(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.usuariosService.getUsuariosByTenant(this.tenantId).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
        this.showNotification('Error al cargar usuarios', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/empresa-principal']);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UsuarioEmpresaDialogComponent, {
      width: '650px',
      disableClose: false,
      data: {
        tenantId: this.tenantId,
        tenantName: this.tenantName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUsuario(result);
      }
    });
  }

  createUsuario(formData: any): void {
    const request: CreateUsuarioRequest = {
      username: formData.username,
      password: formData.password,
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      rolId: formData.rolId,
      tenantId: this.tenantId,
      activo: true
    };

    this.usuariosService.createUsuario(request).subscribe({
      next: (usuario) => {
        this.showNotification('Usuario creado exitosamente', 'success');
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        const errorMsg = error?.error?.message || 'Error al crear usuario';
        this.showNotification(errorMsg, 'error');
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('Contraseña copiada al portapapeles', 'success');
    }).catch(() => {
      this.showNotification('Error al copiar', 'error');
    });
  }

  toggleActivo(usuario: Usuario): void {
    const accion = usuario.activo ? 'desactivar' : 'activar';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `${usuario.activo ? 'Desactivar' : 'Activar'} Usuario`,
        message: `¿Está seguro de ${accion} al usuario "${usuario.username}"?`,
        confirmText: usuario.activo ? 'Desactivar' : 'Activar',
        cancelText: 'Cancelar',
        confirmColor: usuario.activo ? 'warn' : 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.usuariosService.toggleActivo(usuario.usuarioId).subscribe({
          next: () => {
            this.showNotification(`Usuario ${accion}do exitosamente`, 'success');
            this.loadUsuarios();
          },
          error: (error) => {
            console.error('Error al cambiar estado:', error);
            this.showNotification('Error al cambiar estado', 'error');
          }
        });
      }
    });
  }

  resetPassword(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Resetear Contraseña',
        message: `¿Está seguro de resetear la contraseña del usuario "${usuario.username}"?`,
        confirmText: 'Resetear',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const newPassword = this.usuariosService.generateTemporaryPassword();
        this.usuariosService.changePassword(usuario.usuarioId, { newPassword }).subscribe({
          next: () => {
            this.showPasswordResetDialog(usuario.username, newPassword);
          },
          error: (error) => {
            console.error('Error al resetear contraseña:', error);
            this.showNotification('Error al resetear contraseña', 'error');
          }
        });
      }
    });
  }

  showPasswordResetDialog(username: string, password: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: 'Contraseña Reseteada',
        message: `La contraseña del usuario "${username}" ha sido reseteada.\n\nNueva contraseña:\n\n${password}\n\nPor favor copie esta contraseña y compártala con el usuario de forma segura.`,
        confirmText: 'Copiar y Cerrar',
        cancelText: 'Solo Cerrar',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.copyToClipboard(password);
      }
    });
  }

  deleteUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Está seguro de eliminar al usuario "${usuario.username}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.usuariosService.deleteUsuario(usuario.usuarioId).subscribe({
          next: () => {
            this.showNotification('Usuario eliminado exitosamente', 'success');
            this.loadUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.showNotification('Error al eliminar usuario', 'error');
          }
        });
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
