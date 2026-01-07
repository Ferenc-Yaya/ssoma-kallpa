import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { UsuarioKallpa, GrupoKallpa } from '../../../mocks/personal-kallpa.mock';

@Component({
  selector: 'app-usuario-kallpa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './usuario-dialog.html',
  styleUrl: './usuario-dialog.scss'
})
export class UsuarioKallpaDialogComponent implements OnInit {
  usuario: UsuarioKallpa;
  mode: 'crear' | 'editar';
  grupos: GrupoKallpa[];

  constructor(
    public dialogRef: MatDialogRef<UsuarioKallpaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    this.grupos = data.grupos;
    this.usuario = data.usuario || this.getNewUsuario();
  }

  ngOnInit(): void {}

  getNewUsuario(): UsuarioKallpa {
    return {
      usuario_id: Date.now(),
      nombres: '',
      apellidos: '',
      dni: '',
      email: '',
      telefono: '',
      cargo: '',
      area: '',
      grupo_id: 0,
      grupo_nombre: '',
      estado: 'ACTIVO',
      foto_url: '',
      created_at: new Date().toISOString()
    };
  }

  onGrupoChange(): void {
    const grupo = this.grupos.find(g => g.grupo_id === this.usuario.grupo_id);
    if (grupo) {
      this.usuario.grupo_nombre = grupo.nombre;
    }
  }

  guardar(): void {
    // Validaciones básicas
    if (!this.usuario.nombres || !this.usuario.apellidos) {
      alert('Por favor complete nombres y apellidos');
      return;
    }

    if (!this.usuario.dni || this.usuario.dni.length !== 8) {
      alert('Por favor ingrese un DNI válido de 8 dígitos');
      return;
    }

    if (!this.usuario.email || !this.usuario.email.includes('@')) {
      alert('Por favor ingrese un email válido');
      return;
    }

    if (!this.usuario.grupo_id) {
      alert('Por favor seleccione un grupo');
      return;
    }

    this.dialogRef.close(this.usuario);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
