import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface PersonaDialogData {
  persona?: any;
  empresaId: number;
  empresaNombre?: string;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-persona-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './persona-dialog.html',
  styleUrls: ['./persona-dialog.scss']
})
export class PersonaDialogComponent implements OnInit {
  // Modelo del formulario
  persona = {
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    telefono: '',
    email: '',
    cargo: '',
    estado_acreditacion: 'PENDIENTE',
    estado: true
  };

  fotoPreview: string | null = null;
  fotoFile: File | null = null;

  tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' }
  ];

  estadosAcreditacion = [
    { value: 'APTO', label: 'APTO' },
    { value: 'OBSERVADO', label: 'OBSERVADO' },
    { value: 'PENDIENTE', label: 'PENDIENTE' }
  ];

  constructor(
    public dialogRef: MatDialogRef<PersonaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonaDialogData
  ) {}

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.persona) {
      this.loadPersonaData(this.data.persona);
    }
  }

  loadPersonaData(persona: any): void {
    this.persona = {
        tipo_documento: persona.tipo_documento || 'DNI',
        numero_documento: persona.numero_documento || '',
        nombres: persona.nombres || '',
        apellidos: persona.apellidos || '',
        fecha_nacimiento: persona.fecha_nacimiento || '',
        telefono: persona.telefono || '',
        email: persona.email || '',
        cargo: persona.cargo || '',
        estado_acreditacion: persona.estado_acreditacion || 'PENDIENTE',
        estado: persona.estado === 'ACTIVO'
    };

    if (persona.foto) {  // <-- Cambiado de foto_url a foto
        this.fotoPreview = persona.foto;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar los 2MB');
        return;
      }

      this.fotoFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFoto(): void {
    this.fotoPreview = null;
    this.fotoFile = null;
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fotoInput') as HTMLInputElement;
    fileInput?.click();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return !!(
      this.persona.nombres &&
      this.persona.apellidos &&
      this.persona.numero_documento &&
      this.persona.fecha_nacimiento &&
      this.persona.cargo
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    const personaData: any = {
        tipo_documento: this.persona.tipo_documento,
        numero_documento: this.persona.numero_documento,
        nombres: this.persona.nombres,
        apellidos: this.persona.apellidos,
        fecha_nacimiento: this.persona.fecha_nacimiento,
        telefono: this.persona.telefono,
        email: this.persona.email,
        cargo: this.persona.cargo,
        estado_acreditacion: this.persona.estado_acreditacion,
        empresa_id: this.data.empresaId,
        tenant_id: 'KALLPA',
        estado: this.persona.estado ? 'ACTIVO' : 'INACTIVO',
        foto: this.fotoPreview || undefined,
        created_at: new Date().toISOString()
    };

    if (this.data.mode === 'edit' && this.data.persona) {
        personaData.persona_id = this.data.persona.persona_id;
    }

    this.dialogRef.close(personaData);
  }

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  get dialogTitle(): string {
    return this.isEditMode ? 'Editar Trabajador' : 'Agregar Trabajador';
  }
}