import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export interface EmpresaDialogData {
  empresa?: any;
  isEdit: boolean;
}

@Component({
  selector: 'app-empresa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './empresa-dialog.html',
  styleUrl: './empresa-dialog.scss'
})
export class EmpresaDialogComponent implements OnInit {
  empresaForm: FormGroup;
  isEdit: boolean;

  planes = [
    { value: 'FREE', label: 'Free' },
    { value: 'BASIC', label: 'Basic' },
    { value: 'PROFESSIONAL', label: 'Professional' },
    { value: 'ENTERPRISE', label: 'Enterprise' }
  ];

  estados = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
    { value: 'SUSPENDIDO', label: 'Suspendido' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaDialogData
  ) {
    this.isEdit = data.isEdit;
    this.empresaForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.empresa) {
      this.empresaForm.patchValue({
        tenantId: this.data.empresa.tenantId,
        razonSocial: this.data.empresa.razonSocial,
        ruc: this.data.empresa.ruc,
        direccion: this.data.empresa.direccion,
        telefono: this.data.empresa.telefono,
        email: this.data.empresa.email,
        plan: this.data.empresa.plan,
        estado: this.data.empresa.estado
      });

      // Deshabilitar tenant_id en edición (no se puede cambiar)
      this.empresaForm.get('tenantId')?.disable();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      tenantId: ['', [Validators.required, Validators.pattern(/^[A-Z_]+$/)]],
      razonSocial: ['', [Validators.required, Validators.minLength(3)]],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      plan: ['ENTERPRISE', Validators.required],
      estado: ['ACTIVO', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      const formValue = this.empresaForm.getRawValue(); // getRawValue incluye campos disabled
      this.dialogRef.close(formValue);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.empresaForm.controls).forEach(key => {
        this.empresaForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.empresaForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field.hasError('email')) {
      return 'Email inválido';
    }
    if (field.hasError('pattern')) {
      if (fieldName === 'tenantId') {
        return 'Solo mayúsculas y guiones bajos (ej: KALLPA)';
      }
      if (fieldName === 'ruc') {
        return 'RUC debe tener 11 dígitos';
      }
      if (fieldName === 'telefono') {
        return 'Teléfono inválido';
      }
    }
    if (field.hasError('minLength')) {
      return `Mínimo ${field.errors?.['minLength'].requiredLength} caracteres`;
    }

    return '';
  }
}
