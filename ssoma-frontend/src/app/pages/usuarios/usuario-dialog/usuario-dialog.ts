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
  showPasswordFields: boolean = false;
  roles: Rol[] = [];

  // TODO: Obtener de un servicio
  empresasPrincipales = [
    { tenantId: 'KALLPA', nombre: 'KALLPA SAC' },
    { tenantId: 'SYSTEM', nombre: 'Sistema Central' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private rolesService: RolesService,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData
  ) {
    this.isEdit = data.isEdit;
    this.showPasswordFields = !data.isEdit; // Mostrar password solo en creación
  }

  ngOnInit(): void {
    this.createForm();
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        if (this.isEdit && this.data.usuario) {
          this.usuarioForm.patchValue({
            ...this.data.usuario,
            rolId: this.data.usuario.rolId
          });
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

    if (rolData?.requiereTenant) {
      tenantControl?.setValidators([Validators.required]);
      tenantControl?.enable();
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
