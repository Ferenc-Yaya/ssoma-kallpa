import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { TiposContratistaService, TipoContratista } from '../../../core/services/tipos-contratista.service';

export interface ContratistaDialogData {
  empresa?: any;
  isEdit: boolean;
  tenantId: string;
  tipoId?: string;
}

export interface Contacto {
  nombreCompleto: string;
  nombre?: string; // Para compatibilidad con datos existentes
  cargo: string;
  telefono: string;
  email: string;
}

@Component({
  selector: 'app-contratista-dialog',
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
    MatSliderModule
  ],
  templateUrl: './contratista-dialog.html',
  styleUrl: './contratista-dialog.scss'
})
export class ContratistaDialogComponent implements OnInit {
  contratistaForm: FormGroup;
  isEdit: boolean;
  logoPreview: string | null = null;
  selectedFile: File | null = null;
  tiposContratista: TipoContratista[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private tiposContratistaService: TiposContratistaService,
    public dialogRef: MatDialogRef<ContratistaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContratistaDialogData
  ) {
    this.isEdit = data.isEdit;
    this.contratistaForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadTiposContratista();

    if (this.isEdit && this.data.empresa) {
      this.contratistaForm.patchValue({
        razonSocial: this.data.empresa.razonSocial,
        ruc: this.data.empresa.ruc,
        tipoId: this.data.empresa.tipoId,
        direccion: this.data.empresa.direccion,
        telefono: this.data.empresa.telefono,
        email: this.data.empresa.email,
        logoUrl: this.data.empresa.logoUrl,
        sitioWeb: this.data.empresa.sitioWeb,
        rubroComercial: this.data.empresa.rubroComercial,
        scoreSeguridad: this.data.empresa.scoreSeguridad || 0,
        activo: this.data.empresa.activo
      });

      // Cargar contactos existentes
      if (this.data.empresa.contactos && this.data.empresa.contactos.length > 0) {
        this.data.empresa.contactos.forEach((contacto: Contacto) => {
          this.addContacto(contacto);
        });
      }

      if (this.data.empresa.logoUrl) {
        this.logoPreview = this.data.empresa.logoUrl;
      }

      this.contratistaForm.get('ruc')?.disable();
    }
  }

  loadTiposContratista(): void {
    this.tiposContratistaService.getAll().subscribe({
      next: (tipos) => {
        // Filtrar para no mostrar "Empresa Principal" o "HOST"
        this.tiposContratista = tipos.filter(t => t.codigo !== 'HOST');

        // Si hay un tipoId predefinido, seleccionarlo
        if (this.data.tipoId && !this.isEdit) {
          this.contratistaForm.patchValue({ tipoId: this.data.tipoId });
        }

        // Forzar detección de cambios para evitar NG0100
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar tipos de contratista:', error);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      razonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      tipoId: ['', Validators.required],
      direccion: [''],
      telefono: ['', [Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      logoUrl: [''],
      sitioWeb: ['', [Validators.maxLength(100)]],
      rubroComercial: ['', [Validators.maxLength(100)]],
      scoreSeguridad: [0],
      activo: [true],
      contactos: this.fb.array([])
    });
  }

  get contactos(): FormArray {
    return this.contratistaForm.get('contactos') as FormArray;
  }

  addContacto(contacto?: Contacto): void {
    const contactoGroup = this.fb.group({
      nombreCompleto: [contacto?.nombreCompleto || contacto?.nombre || '', Validators.required],
      cargo: [contacto?.cargo || ''],
      telefono: [contacto?.telefono || ''],
      email: [contacto?.email || '', Validators.email]
    });
    this.contactos.push(contactoGroup);
  }

  removeContacto(index: number): void {
    this.contactos.removeAt(index);
  }

  onSubmit(): void {
    if (this.contratistaForm.valid) {
      const formValue = this.contratistaForm.getRawValue();

      if (this.selectedFile) {
        formValue.logoFile = this.selectedFile;
      }

      this.dialogRef.close(formValue);
    } else {
      Object.keys(this.contratistaForm.controls).forEach(key => {
        this.contratistaForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contratistaForm.get(fieldName);
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

      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen');
        input.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no debe superar 5MB');
        input.value = '';
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }

    input.value = '';
  }

  removeLogo(): void {
    this.selectedFile = null;
    this.logoPreview = null;
    this.contratistaForm.patchValue({ logoUrl: '' });
  }

  formatScore(value: number): string {
    return `${value}`;
  }
}
