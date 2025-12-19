import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Empresa } from '../../../mocks/empresas.mock';

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
    MatSelectModule
  ],
  templateUrl: './empresa-dialog.html',
  styleUrl: './empresa-dialog.scss'
})
export class EmpresaDialogComponent {
  empresa: Partial<Empresa>;
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empresa?: Empresa }
  ) {
    this.isEdit = !!data.empresa;
    this.empresa = data.empresa ? { ...data.empresa } : {
      razonSocial: '',
      ruc: '',
      tipo: undefined as any,
      direccion: '',
      telefono: '',
      email: '',
      estado: 'ACTIVO',
      tenant_id: 'KALLPA',
      created_at: new Date().toISOString()
    };
  }

  isValid(): boolean {
    return !!(
      this.empresa.razonSocial?.trim() &&
      this.empresa.ruc?.trim() &&
      this.empresa.ruc.length === 11 &&
      this.empresa.tipo &&
      this.empresa.direccion?.trim() &&
      this.empresa.telefono?.trim() &&
      this.empresa.email?.trim() &&
      this.empresa.email.includes('@')
    );
  }

  onSave(): void {
    if (this.isValid()) {
      this.dialogRef.close(this.empresa);
    }
  }
}