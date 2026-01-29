import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RolesService, Rol } from '../../../core/services/roles.service';

interface Usuario {
  usuarioId?: string;
  username: string;
  nombreCompleto: string;
  email: string;
  rolId?: string;
  rolCodigo?: string;
  rol?: string;
  tenantId: string | null;
  empresaNombre?: string;
  activo: boolean;
}

export interface UsuarioDialogData {
  usuario?: Usuario;
  isEdit: boolean;
  isViewOnly?: boolean;
  disableTenant?: boolean;
  isCreate?: boolean;
}

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './usuario-dialog.html',
  styleUrl: './usuario-dialog.scss'
})
export class UsuarioDialogComponent implements OnInit {
  usuarioForm!: FormGroup;
  isEdit: boolean = false;
  isViewOnly: boolean = false;
  isCreate: boolean = false;
  disableTenant: boolean = false;
  showPasswordFields: boolean = false;
  roles: Rol[] = [];
  isSuperAdminSelected: boolean = false;
  selectedRolNombre: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // TODO: Obtener de un servicio
  // Nota: SYSTEM no se incluye porque solo es para SUPER_ADMIN (se asigna automáticamente)
  empresasPrincipales = [
    { tenantId: 'KALLPA', nombre: 'KALLPA SAC' },
    { tenantId: 'LUZDELSUR', nombre: 'Luz del Sur' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private rolesService: RolesService,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData
  ) {
    this.isEdit = data.isEdit;
    this.isViewOnly = data.isViewOnly || false;
    this.isCreate = data.isCreate || false;
    this.disableTenant = data.disableTenant || false;
    this.showPasswordFields = this.isCreate || (!data.isEdit && !this.isViewOnly);

    // En modo creación, inicializar valores para SUPER_ADMIN
    if (this.isCreate) {
      this.selectedRolNombre = 'Super Administrador';
      this.isSuperAdminSelected = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getAllRoles().subscribe({
      next: (roles) => {
        // En modo creación, solo mostrar SUPER_ADMIN (esta pantalla es solo para crear superadmins)
        // En modo edición, filtrar SUPER_ADMIN (no debe poder cambiarse a superadmin)
        // En modo solo lectura, mostrar todos los roles
        if (this.isCreate) {
          this.roles = roles.filter(r => r.codigo === 'SUPER_ADMIN');
        } else if (this.isEdit && !this.isViewOnly) {
          this.roles = roles.filter(r => r.codigo !== 'SUPER_ADMIN');
        } else {
          this.roles = roles;
        }
        // En modo creación, auto-seleccionar SUPER_ADMIN
        if (this.isCreate && this.roles.length > 0) {
          const superAdminRol = this.roles.find(r => r.codigo === 'SUPER_ADMIN');
          if (superAdminRol) {
            this.usuarioForm.patchValue({ rolId: superAdminRol.rolId });
            this.onRolChange(superAdminRol.rolId);
          }
        }
        // Cargar datos del usuario si existe (en modo edición o solo lectura)
        if (this.data.usuario) {
          this.usuarioForm.patchValue({
            username: this.data.usuario.username,
            nombreCompleto: this.data.usuario.nombreCompleto,
            email: this.data.usuario.email,
            rolId: this.data.usuario.rolId,
            tenantId: this.data.usuario.tenantId,
            empresaNombre: this.data.usuario.empresaNombre,
            activo: this.data.usuario.activo
          });
          // Ejecutar onRolChange inicial para establecer el estado correcto
          if (this.data.usuario.rolId) {
            this.onRolChange(this.data.usuario.rolId);
          }
        }
        // Observar cambios en el rol para habilitar/deshabilitar tenant
        this.usuarioForm.get('rolId')?.valueChanges.subscribe(rolId => {
          this.onRolChange(rolId);
        });
      },
      error: (error) => {
        console.error('Error cargando roles:', error);
      }
    });
  }

  createForm(): void {
    this.usuarioForm = this.fb.group({
      username: [
        { value: '', disabled: this.isEdit },
        [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(/^[a-z0-9._-]+$/)]
      ],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', this.isEdit ? [] : [Validators.required]],
      rolId: ['', Validators.required],
      tenantId: [''],
      empresaNombre: [''],
      activo: [true]
    });
  }

  onRolChange(rolId: string): void {
    const rolData = this.roles.find(r => r.rolId === rolId);
    const tenantControl = this.usuarioForm.get('tenantId');

    // Verificar si es SUPER_ADMIN y guardar nombre del rol
    this.isSuperAdminSelected = rolData?.codigo === 'SUPER_ADMIN';
    this.selectedRolNombre = rolData?.nombre || '';

    if (this.isSuperAdminSelected) {
      // SUPER_ADMIN siempre tiene tenant SYSTEM
      tenantControl?.setValue('SYSTEM');
      tenantControl?.clearValidators();
      tenantControl?.disable();
    } else if (rolData?.requiereTenant) {
      tenantControl?.setValidators([Validators.required]);
      tenantControl?.enable();
      // Limpiar si tenía SYSTEM
      if (tenantControl?.value === 'SYSTEM') {
        tenantControl?.setValue('');
      }
    } else {
      tenantControl?.clearValidators();
      tenantControl?.setValue(null);
      tenantControl?.disable();
    }
    tenantControl?.updateValueAndValidity();
  }

  getRolDescription(rolId: string): string {
    const rolData = this.roles.find(r => r.rolId === rolId);
    return rolData?.descripcion || '';
  }

  getRolNombre(): string {
    if (this.selectedRolNombre) {
      return this.selectedRolNombre;
    }
    // Fallback para modo creación si aún no se ha cargado el nombre
    if (this.isCreate && this.isSuperAdminSelected) {
      return 'Super Administrador';
    }
    const rolId = this.usuarioForm.get('rolId')?.value;
    const rolData = this.roles.find(r => r.rolId === rolId);
    return rolData?.nombre || this.data.usuario?.rolCodigo || '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  generatePassword(): void {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    // Asegurar al menos uno de cada tipo
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];

    // Completar hasta 8 caracteres
    for (let i = 4; i < 8; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    // Mezclar
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    this.usuarioForm.patchValue({
      password: password,
      confirmPassword: password
    });

    this.showPassword = true;
    this.showConfirmPassword = true;
  }

  requiereTenant(): boolean {
    const rolId = this.usuarioForm.get('rolId')?.value;
    const rolData = this.roles.find(r => r.rolId === rolId);
    return rolData?.requiereTenant || false;
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
        return 'Solo letras minúsculas, números, puntos, guiones y guión bajo';
      }
    }
    return '';
  }

  passwordsMatch(): boolean {
    if (!this.showPasswordFields) return true;
    const password = this.usuarioForm.get('password')?.value;
    const confirmPassword = this.usuarioForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.usuarioForm.valid && this.passwordsMatch()) {
      const formValue = this.usuarioForm.getRawValue();

      // No enviar contraseña en edición si no se cambió
      if (this.isEdit) {
        delete formValue.password;
        delete formValue.confirmPassword;
      }

      this.dialogRef.close(formValue);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
    }
  }
}
