import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Sede {
  sedeId?: number;
  nombre: string;
  direccion: string;
  esPrincipal: boolean;
  activo: boolean;
}

export interface SedeDialogData {
  sede?: Sede;
  isEdit: boolean;
  empresaNombre: string;
}

@Component({
  selector: 'app-sede-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sede-dialog.html',
  styleUrl: './sede-dialog.scss'
})
export class SedeDialogComponent implements OnInit {
  sedeForm!: FormGroup;
  isEdit: boolean = false;
  empresaNombre: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SedeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SedeDialogData
  ) {
    this.isEdit = data.isEdit;
    this.empresaNombre = data.empresaNombre;
  }

  ngOnInit(): void {
    this.createForm();
    if (this.isEdit && this.data.sede) {
      this.sedeForm.patchValue(this.data.sede);
    }
  }

  createForm(): void {
    this.sedeForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      esPrincipal: [false],
      activo: [true]
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.sedeForm.get(fieldName);
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
    return '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.sedeForm.valid) {
      this.dialogRef.close(this.sedeForm.getRawValue());
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.sedeForm.controls).forEach(key => {
        this.sedeForm.get(key)?.markAsTouched();
      });
    }
  }
}
