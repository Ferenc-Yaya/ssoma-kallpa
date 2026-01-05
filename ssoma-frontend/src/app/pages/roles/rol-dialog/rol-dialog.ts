import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Rol {
  rolId?: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  nivelJerarquia: number;
  requiereTenant: boolean;
  activo: boolean;
}

export interface RolDialogData {
  rol?: Rol;
  isEdit: boolean;
}

@Component({
  selector: 'app-rol-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './rol-dialog.html',
  styleUrl: './rol-dialog.scss'
})
export class RolDialogComponent implements OnInit {
  rolForm!: FormGroup;
  isEdit: boolean = false;

  nivelesJerarquia = [
    { value: 1, label: 'Nivel 1 - Sistema (Super Admin)', description: 'Acceso completo sin restricciones' },
    { value: 2, label: 'Nivel 2 - Empresa Principal', description: 'Administración de empresa principal' },
    { value: 3, label: 'Nivel 3 - Contratista', description: 'Administración de contratista' },
    { value: 4, label: 'Nivel 4 - Usuario', description: 'Acceso limitado según permisos' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RolDialogData
  ) {
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.createForm();
    if (this.isEdit && this.data.rol) {
      this.rolForm.patchValue(this.data.rol);
    }

    // Observar cambios en nivel de jerarquía
    this.rolForm.get('nivelJerarquia')?.valueChanges.subscribe(nivel => {
      this.onNivelChange(nivel);
    });
  }

  createForm(): void {
    this.rolForm = this.fb.group({
      codigo: [
        { value: '', disabled: this.isEdit },
        [Validators.required, Validators.pattern(/^[A-Z_]+$/), Validators.maxLength(50)]
      ],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      nivelJerarquia: ['', Validators.required],
      requiereTenant: [true],
      activo: [true]
    });
  }

  onNivelChange(nivel: number): void {
    // Nivel 1 (Super Admin) no requiere tenant
    if (nivel === 1) {
      this.rolForm.patchValue({ requiereTenant: false });
    } else if (!this.isEdit) {
      // Para nuevos roles de otros niveles, por defecto requieren tenant
      this.rolForm.patchValue({ requiereTenant: true });
    }
  }

  getNivelDescription(nivel: number): string {
    const nivelData = this.nivelesJerarquia.find(n => n.value === nivel);
    return nivelData?.description || '';
  }

  getErrorMessage(fieldName: string): string {
    const field = this.rolForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo es requerido';
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
      if (fieldName === 'codigo') {
        return 'Solo letras mayúsculas y guiones bajos';
      }
    }
    return '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.rolForm.valid) {
      this.dialogRef.close(this.rolForm.getRawValue());
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.rolForm.controls).forEach(key => {
        this.rolForm.get(key)?.markAsTouched();
      });
    }
  }
}
