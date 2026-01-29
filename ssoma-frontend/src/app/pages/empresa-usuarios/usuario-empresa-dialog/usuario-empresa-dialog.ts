import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RolesService, Rol } from '../../../core/services/roles.service';
import { UsuariosService, Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '../../../core/services/usuarios.service'; // Importar Usuario, Create/Update Request

export interface UsuarioEmpresaDialogData {
  tenantId: string;
  tenantName: string;
  usuario?: Usuario; // Hacer el usuario opcional para el modo de edición
}

@Component({
  selector: 'app-usuario-empresa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './usuario-empresa-dialog.html',
  styleUrl: './usuario-empresa-dialog.scss'
})
export class UsuarioEmpresaDialogComponent implements OnInit {
  usuarioForm!: FormGroup;
  roles: Rol[] = [];
  passwordVisible: boolean = true;
  confirmPasswordVisible: boolean = true;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioEmpresaDialogComponent>,
    private rolesService: RolesService,
    private cdr: ChangeDetectorRef,
    private usuariosService: UsuariosService,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioEmpresaDialogData // Inyectar data
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.usuario; // Determinar modo edición

    this.createForm(this.isEditMode);
    this.loadRoles();

    if (this.isEditMode && this.data.usuario) {
      // Si estamos en modo edición, rellenar el formulario
      this.usuarioForm.patchValue({
        username: this.data.usuario.username,
        nombreCompleto: this.data.usuario.nombreCompleto,
        email: this.data.usuario.email,
        rolId: this.data.usuario.rolId,
      });
      // Deshabilitar username en modo edición
      this.usuarioForm.get('username')?.disable();
    } else {
      // Autogenerar contraseña solo en modo creación
      const tempPassword = this.usuariosService.generateTemporaryPassword();
      this.usuarioForm.patchValue({
        password: tempPassword,
        confirmPassword: tempPassword
      });
    }
  }

  loadRoles(): void {
    this.rolesService.getAllRoles().subscribe({
      next: (roles) => {
        // Filtrar roles que requieren tenant y no son SUPER_ADMIN
        this.roles = roles.filter(r => r.requiereTenant !== false && r.codigo !== 'SUPER_ADMIN');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando roles:', error);
      }
    });
  }

  createForm(isEdit: boolean): void {
    this.usuarioForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(/^[a-z0-9._-]+$/)]
      ],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      // Contraseña y Confirmación son opcionales en edición, requeridas en creación
      password: ['', isEdit ? [] : [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', isEdit ? [] : [Validators.required]],
      rolId: ['', Validators.required]
    });
  }

  regeneratePassword(): void {
    const tempPassword = this.usuariosService.generateTemporaryPassword();
    this.usuarioForm.patchValue({
      password: tempPassword,
      confirmPassword: tempPassword
    });
    // Make password visible again when regenerated
    this.passwordVisible = true;
    this.confirmPasswordVisible = true;
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirm') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  getRolDescription(rolId: string): string {
    const rolData = this.roles.find(r => r.rolId === rolId);
    return rolData?.descripcion || '';
  }

  getErrorMessage(fieldName: string): string {
    const field = this.usuarioForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field.hasError('email')) {
      return 'Email inválido';
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `No debe exceder ${maxLength} caracteres`;
    }
    if (field.hasError('pattern')) {
      if (fieldName === 'username') {
        return 'Solo letras minúsculas, números, puntos, guiones';
      }
    }
    return '';
  }

  passwordsMatch(): boolean {
    const password = this.usuarioForm.get('password')?.value;
    const confirmPassword = this.usuarioForm.get('confirmPassword')?.value;
    // Si no estamos en modo edición, o si las contraseñas están vacías, no aplicar la validación de coincidencia
    if (this.isEditMode && (!password && !confirmPassword)) return true;
    return password === confirmPassword;
  }

  onCancel(): void {
    this.dialogRef.close(false); // Indicar cancelación o fallo
  }

  onSubmit(): void {
    if (this.usuarioForm.valid && this.passwordsMatch()) {
      const formValue = this.usuarioForm.getRawValue(); // Incluye campos deshabilitados

      if (this.isEditMode && this.data.usuario) {
        // MODO EDICIÓN
        const updateRequest: UpdateUsuarioRequest = {
          nombreCompleto: formValue.nombreCompleto,
          email: formValue.email,
          rolId: formValue.rolId,
          activo: this.data.usuario.activo // Mantener el estado activo original
          // No se actualiza username ni password en este flujo
        };
        this.usuariosService.updateUsuario(this.data.usuario.usuarioId, updateRequest).subscribe({
          next: () => {
            this.dialogRef.close({ success: true, operation: 'update' }); // Indicar éxito y operación
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            this.dialogRef.close({ success: false, operation: 'update', error: error?.error?.message }); // Indicar fallo
          }
        });
      } else {
        // MODO CREACIÓN
        const createRequest: CreateUsuarioRequest = {
          username: formValue.username,
          password: formValue.password, // Ya viene del formulario
          nombreCompleto: formValue.nombreCompleto,
          email: formValue.email,
          rolId: formValue.rolId,
          tenantId: this.data.tenantId,
          activo: true
        };

        this.usuariosService.createUsuario(createRequest).subscribe({
          next: (usuario) => {
            this.dialogRef.close({ success: true, operation: 'create', username: usuario.username, password: createRequest.password }); // Devolver contraseña para mostrar
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            this.dialogRef.close({ success: false, operation: 'create', error: error?.error?.message }); // Indicar fallo
          }
        });
      }
    } else {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
      // Si la validación falla antes de enviar, cerrar con false o un objeto de error
      this.dialogRef.close({ success: false, operation: this.isEditMode ? 'update' : 'create', error: 'Formulario inválido' });
    }
  }
}
