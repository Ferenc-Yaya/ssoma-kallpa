import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { GrupoKallpa } from '../../../mocks/personal-kallpa.mock';

@Component({
  selector: 'app-grupo-kallpa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './grupo-dialog.html',
  styleUrl: './grupo-dialog.scss'
})
export class GrupoKallpaDialogComponent implements OnInit {
  grupo: GrupoKallpa;
  mode: 'crear' | 'editar';

  permisosDisponibles = [
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'eliminar', nombre: 'Eliminar' },
    { id: 'aprobar', nombre: 'Aprobar' },
    { id: 'reportes', nombre: 'Reportes' }
  ];

  permisosSeleccionados: { [key: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<GrupoKallpaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    this.grupo = data.grupo || this.getNewGrupo();

    // Inicializar permisos seleccionados
    this.permisosDisponibles.forEach(p => {
      this.permisosSeleccionados[p.id] = this.grupo.permisos.includes(p.id);
    });
  }

  ngOnInit(): void {}

  getNewGrupo(): GrupoKallpa {
    return {
      grupo_id: Date.now(),
      nombre: '',
      descripcion: '',
      permisos: [],
      created_at: new Date().toISOString()
    };
  }

  guardar(): void {
    // Validaciones básicas
    if (!this.grupo.nombre) {
      alert('Por favor ingrese el nombre del grupo');
      return;
    }

    if (!this.grupo.descripcion) {
      alert('Por favor ingrese la descripción del grupo');
      return;
    }

    // Actualizar permisos basado en checkboxes
    this.grupo.permisos = Object.keys(this.permisosSeleccionados)
      .filter(key => this.permisosSeleccionados[key]);

    if (this.grupo.permisos.length === 0) {
      alert('Por favor seleccione al menos un permiso');
      return;
    }

    this.dialogRef.close(this.grupo);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
