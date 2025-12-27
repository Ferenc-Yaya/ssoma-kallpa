import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nuevo-tipo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './nuevo-tipo-dialog.html',
  styleUrl: './nuevo-tipo-dialog.scss'
})
export class NuevoTipoDialogComponent {
  nombre: string = '';
  descripcion: string = '';

  constructor(
    public dialogRef: MatDialogRef<NuevoTipoDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.nombre.trim()) {
      this.dialogRef.close({
        nombre: this.nombre.trim(),
        descripcion: this.descripcion.trim()
      });
    }
  }

  isValid(): boolean {
    return this.nombre.trim().length > 0;
  }
}
