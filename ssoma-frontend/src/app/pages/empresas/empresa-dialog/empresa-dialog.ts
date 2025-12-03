import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Empresa } from '../../../mocks/empresas.mock';

@Component({
  selector: 'app-empresa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
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
      tipo: 'PERMANENTE',
      estadoHabilitacion: 'PENDIENTE'
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.isValid()) {
      this.dialogRef.close(this.empresa);
    }
  }

  isValid(): boolean {
    return !!(
      this.empresa.razonSocial &&
      this.empresa.ruc &&
      this.empresa.tipo &&
      this.empresa.estadoHabilitacion &&
      this.empresa.ruc.length === 11
    );
  }
}