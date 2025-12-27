import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Empresa, EmpresaContacto } from '../../../mocks/empresas.mock';
import { TIPOS_CONTRATISTAS_MOCK } from '../../../mocks/reglas-negocio.mock';

@Component({
  selector: 'app-empresa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './empresa-dialog.html',
  styleUrl: './empresa-dialog.scss'
})
export class EmpresaDialogComponent {
  empresa: Partial<Empresa>;
  isEdit: boolean;
  tiposContratista = TIPOS_CONTRATISTAS_MOCK;
  contactos: EmpresaContacto[] = [];

  constructor(
    public dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empresa?: Empresa }
  ) {
    this.isEdit = !!data.empresa;
    this.empresa = data.empresa ? { ...data.empresa } : {
      razonSocial: '',
      ruc: '',
      tipo_contratista_id: undefined,
      direccion: '',
      telefono: '',
      email: '',
      estado: 'ACTIVO',
      tenant_id: 'KALLPA',
      created_at: new Date().toISOString()
    };

    // Cargar contactos si existen
    this.contactos = this.empresa.contactos ? [...this.empresa.contactos] : [];
  }

  agregarContacto(): void {
    this.contactos.push({
      nombre_completo: '',
      cargo: '',
      telefono: '',
      email: '',
      es_principal: this.contactos.length === 0 // Primer contacto es principal por defecto
    });
  }

  eliminarContacto(index: number): void {
    this.contactos.splice(index, 1);
    // Si se eliminó el principal y hay otros contactos, marcar el primero como principal
    if (this.contactos.length > 0 && !this.contactos.some(c => c.es_principal)) {
      this.contactos[0].es_principal = true;
    }
  }

  onPrincipalChange(index: number): void {
    // Solo un contacto puede ser principal
    if (this.contactos[index].es_principal) {
      this.contactos.forEach((c, i) => {
        if (i !== index) {
          c.es_principal = false;
        }
      });
    }
  }

  isValid(): boolean {
    const empresaValida = !!(
      this.empresa.razonSocial?.trim() &&
      this.empresa.ruc?.trim() &&
      this.empresa.ruc.length === 11 &&
      this.empresa.tipo_contratista_id &&
      this.empresa.direccion?.trim() &&
      this.empresa.telefono?.trim() &&
      this.empresa.email?.trim() &&
      this.empresa.email.includes('@')
    );

    // Validar que los contactos tengan todos los campos obligatorios
    const contactosValidos = this.contactos.every(c =>
      c.nombre_completo?.trim() &&
      c.cargo?.trim() &&
      c.telefono?.trim() &&
      c.email?.trim() &&
      c.email.includes('@')
    );

    return empresaValida && (this.contactos.length === 0 || contactosValidos);
  }

  onSave(): void {
    if (this.isValid()) {
      this.empresa.contactos = this.contactos;
      this.dialogRef.close(this.empresa);
    }
  }
}