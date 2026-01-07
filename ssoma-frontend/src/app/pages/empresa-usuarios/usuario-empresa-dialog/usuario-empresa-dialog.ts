import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RolesService, Rol } from '../../../core/services/roles.service';

export interface UsuarioEmpresaDialogData {
  tenantId: string;
  tenantName: string;
}

@Component({
  selector: 'app-usuario-empresa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './usuario-empresa-dialog.html',
  styleUrl: './usuario-empresa-dialog.scss'
})
export class UsuarioEmpresaDialogComponent implements OnInit {
  usuarioForm!: FormGroup;
  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioEmpresaDialogComponent>,
    private rolesService: RolesService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioEmpresaDialogData
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadRoles();
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

  createForm(): void {
    this.usuarioForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(/^[a-z0-9._-]+$/)]
      ],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      rolId: ['', Validators.required]
    });
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
    return password === confirmPassword;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.usuarioForm.valid && this.passwordsMatch()) {
      const formValue = this.usuarioForm.getRawValue();
      // Agregar tenantId de la empresa
      formValue.tenantId = this.data.tenantId;
      formValue.activo = true;
      this.dialogRef.close(formValue);
    } else {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
    }
  }
}
