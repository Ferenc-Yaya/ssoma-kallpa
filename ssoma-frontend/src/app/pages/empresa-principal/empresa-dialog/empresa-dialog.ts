import { Component, Inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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
  logoPreview: string | null = null;
  selectedFile: File | null = null;
  uploadingLogo = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaDialogData
  ) {
    this.isEdit = data.isEdit;
    this.empresaForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.empresa) {
      this.empresaForm.patchValue({
        razonSocial: this.data.empresa.razonSocial,
        ruc: this.data.empresa.ruc,
        direccion: this.data.empresa.direccion,
        telefono: this.data.empresa.telefono,
        email: this.data.empresa.email,
        logoUrl: this.data.empresa.logoUrl,
        sitioWeb: this.data.empresa.sitioWeb,
        rubroComercial: this.data.empresa.rubroComercial,
        activo: this.data.empresa.activo
      });

      // Establecer preview del logo existente
      if (this.data.empresa.logoUrl) {
        this.logoPreview = this.data.empresa.logoUrl;
      }

      // Deshabilitar RUC en edición (no se puede cambiar)
      this.empresaForm.get('ruc')?.disable();
    }

    // Auto-generar tenant ID al cambiar razón social (solo en creación)
    if (!this.isEdit) {
      this.empresaForm.get('razonSocial')?.valueChanges.subscribe(value => {
        if (value) {
          const tenantId = this.generateTenantId(value);
          this.empresaForm.patchValue({ tenantId }, { emitEvent: false });
        }
      });
    }
  }

  generateTenantId(razonSocial: string): string {
    // Convertir a mayúsculas, eliminar caracteres especiales, reemplazar espacios con _
    return razonSocial
      .toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^A-Z0-9\s]/g, '') // Solo letras, números y espacios
      .trim()
      .replace(/\s+/g, '_') // Reemplazar espacios con _
      .substring(0, 50); // Limitar a 50 caracteres
  }

  createForm(): FormGroup {
    return this.fb.group({
      tenantId: [{ value: '', disabled: true }], // Auto-generado, solo lectura
      razonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      direccion: [''],
      telefono: ['', [Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      logoUrl: [''],
      sitioWeb: ['', [Validators.maxLength(100)]],
      rubroComercial: ['', [Validators.maxLength(100)]],
      activo: [true]
    });
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      const formValue = this.empresaForm.getRawValue(); // getRawValue incluye campos disabled

      // Agregar el archivo seleccionado si existe
      if (this.selectedFile) {
        formValue.logoFile = this.selectedFile;
      }

      // Si es creación, enviar tenantId generado
      if (!this.isEdit) {
        // El tenantId se enviará al backend para crear el tenant
        this.dialogRef.close(formValue);
      } else {
        // En edición, no enviar tenantId
        const { tenantId, ...updateData } = formValue;
        this.dialogRef.close(updateData);
      }
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
      if (fieldName === 'ruc') {
        return 'RUC debe tener 11 dígitos';
      }
      if (fieldName === 'telefono') {
        return 'Teléfono inválido';
      }
    }
    if (field.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }

    return '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen');
        input.value = ''; // Limpiar input
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no debe superar 5MB');
        input.value = ''; // Limpiar input
        return;
      }

      this.selectedFile = file;

      // Crear preview inmediatamente
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }

    // Limpiar el input para que se pueda seleccionar el mismo archivo de nuevo
    input.value = '';
  }

  removeLogo(): void {
    this.selectedFile = null;
    this.logoPreview = null;
    this.empresaForm.patchValue({ logoUrl: '' });
  }
}
