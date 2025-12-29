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

  estadosHabilitacion = [
    { value: 'APROBADO', label: 'Aprobado' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'RECHAZADO', label: 'Rechazado' },
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
        estadoHabilitacion: this.data.empresa.estadoHabilitacion,
        activo: this.data.empresa.activo
      });

      // Deshabilitar tenant_id y RUC en edición (no se pueden cambiar)
      this.empresaForm.get('tenantId')?.disable();
      this.empresaForm.get('ruc')?.disable();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      tenantId: ['', [Validators.required, Validators.pattern(/^[A-Z_]+$/)]],
      razonSocial: ['', [Validators.required, Validators.minLength(3)]],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      tipoId: [''], // Se debe obtener el ID del tipo 'HOST' del backend
      direccion: [''],
      telefono: ['', [Validators.pattern(/^[0-9\-\+\s]+$/)]],
      email: ['', [Validators.email]],
      estadoHabilitacion: ['PENDIENTE', Validators.required],
      activo: [true]
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
