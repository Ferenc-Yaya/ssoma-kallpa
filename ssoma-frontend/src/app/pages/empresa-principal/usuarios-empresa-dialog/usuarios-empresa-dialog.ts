import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { UsuariosService, Usuario, CreateUsuarioRequest } from '../../../core/services/usuarios.service';
import { RolesService, Rol } from '../../../core/services/roles.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

export interface UsuariosEmpresaDialogData {
  empresa: {
    tenantId: string;
    razonSocial: string;
  };
}

@Component({
  selector: 'app-usuarios-empresa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatExpansionModule
  ],
  templateUrl: './usuarios-empresa-dialog.html',
  styleUrl: './usuarios-empresa-dialog.scss'
})
export class UsuariosEmpresaDialogComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  displayedColumns: string[] = ['username', 'nombreCompleto', 'email', 'rol', 'activo', 'acciones'];
  loading = true;
  showCreateForm = false;
  usuarioForm: FormGroup;
  editingUserId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<UsuariosEmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuariosEmpresaDialogData,
    private usuariosService: UsuariosService,
    private rolesService: RolesService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadRoles();
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      rolId: ['', Validators.required]
    });
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuariosService.getUsuariosByTenant(this.data.empresa.tenantId).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
        this.showNotification('Error al cargar usuarios', 'error');
      }
    });
  }

  loadRoles(): void {
    this.rolesService.getAllRoles().subscribe({
      next: (roles) => {
        // Filtrar roles que requieren tenant (no SUPER_ADMIN)
        this.roles = roles.filter(r => r.requiereTenant !== false && r.codigo !== 'SUPER_ADMIN');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    // Si se abre el formulario para crear, o se cierra, se resetea el modo edición
    if (this.showCreateForm || !this.showCreateForm) {
      this.usuarioForm.reset();
      this.editingUserId = null;
    }
  }

  openEditDialog(usuario: Usuario): void {
    this.editingUserId = usuario.usuarioId;
    this.usuarioForm.patchValue({
      username: usuario.username,
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email,
      rolId: usuario.rolId,
    });
    // Deshabilitar username en modo edición
    this.usuarioForm.get('username')?.disable();
    this.showCreateForm = true;
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.getRawValue(); // Usar getRawValue para incluir campos deshabilitados

      if (this.editingUserId) {
        // MODO EDICIÓN
        this.usuariosService.updateUsuario(this.editingUserId, formValue).subscribe({
          next: () => {
            this.showNotification('Usuario actualizado exitosamente', 'success');
            this.loadUsuarios();
            this.showCreateForm = false;
            this.editingUserId = null;
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            this.showNotification('Error al actualizar usuario', 'error');
          }
        });
      } else {
        // MODO CREACIÓN
        const password = this.usuariosService.generateTemporaryPassword();
        const request: CreateUsuarioRequest = {
          username: formValue.username,
          password: password,
          nombreCompleto: formValue.nombreCompleto,
          email: formValue.email,
          rolId: formValue.rolId,
          tenantId: this.data.empresa.tenantId,
          activo: true
        };

        this.usuariosService.createUsuario(request).subscribe({
          next: (usuario) => {
            this.showPasswordDialog(usuario, password);
            this.loadUsuarios();
            this.showCreateForm = false;
            this.usuarioForm.reset();
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            const errorMsg = error?.error?.message || 'Error al crear usuario';
            this.showNotification(errorMsg, 'error');
          }
        });
      }
    } else {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
    }
  }

  showPasswordDialog(usuario: Usuario, password: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: 'Usuario Creado Exitosamente',
        message: `El usuario "${usuario.username}" ha sido creado.\n\nContraseña temporal:\n\n${password}\n\nPor favor copie esta contraseña y compártala con el usuario de forma segura.`,
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
            this.showPasswordDialog(usuario, newPassword);
          },
          error: (error) => {
            console.error('Error al resetear contraseña:', error);
            this.showNotification('Error al resetear contraseña', 'error');
          }
        });
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

  getErrorMessage(fieldName: string): string {
    const field = this.usuarioForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) return 'Este campo es requerido';
    if (field.hasError('email')) return 'Email inválido';
    if (field.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    return '';
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
