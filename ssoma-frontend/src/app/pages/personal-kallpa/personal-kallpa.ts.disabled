import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { USUARIOS_KALLPA_MOCK, UsuarioKallpa, GRUPOS_KALLPA_MOCK, GrupoKallpa } from '../../mocks/personal-kallpa.mock';
import { UsuarioKallpaDialogComponent } from './usuario-dialog/usuario-dialog';
import { GrupoKallpaDialogComponent } from './grupo-dialog/grupo-dialog';

@Component({
  selector: 'app-personal-kallpa',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './personal-kallpa.html',
  styleUrl: './personal-kallpa.scss'
})
export class PersonalKallpaComponent implements OnInit {
  // Usuarios
  usuarios: UsuarioKallpa[] = [];
  usuariosFiltrados: UsuarioKallpa[] = [];
  displayedColumnsUsuarios: string[] = ['foto', 'nombres', 'dni', 'cargo', 'area', 'grupo', 'estado', 'acciones'];

  // Grupos
  grupos: GrupoKallpa[] = [];
  gruposFiltrados: GrupoKallpa[] = [];
  displayedColumnsGrupos: string[] = ['nombre', 'descripcion', 'permisos', 'acciones'];

  // Filtros
  searchTextUsuarios: string = '';
  filterEstadoUsuarios: string = 'todos';
  filterGrupoUsuarios: number = 0;

  searchTextGrupos: string = '';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.usuarios = USUARIOS_KALLPA_MOCK;
    this.grupos = GRUPOS_KALLPA_MOCK;
    this.aplicarFiltrosUsuarios();
    this.aplicarFiltrosGrupos();
  }

  // ===== USUARIOS =====
  aplicarFiltrosUsuarios(): void {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const matchSearch = !this.searchTextUsuarios ||
        u.nombres.toLowerCase().includes(this.searchTextUsuarios.toLowerCase()) ||
        u.apellidos.toLowerCase().includes(this.searchTextUsuarios.toLowerCase()) ||
        u.dni.includes(this.searchTextUsuarios) ||
        u.email.toLowerCase().includes(this.searchTextUsuarios.toLowerCase());

      const matchEstado = this.filterEstadoUsuarios === 'todos' ||
        u.estado === this.filterEstadoUsuarios;

      const matchGrupo = this.filterGrupoUsuarios === 0 ||
        u.grupo_id === this.filterGrupoUsuarios;

      return matchSearch && matchEstado && matchGrupo;
    });
  }

  limpiarFiltrosUsuarios(): void {
    this.searchTextUsuarios = '';
    this.filterEstadoUsuarios = 'todos';
    this.filterGrupoUsuarios = 0;
    this.aplicarFiltrosUsuarios();
  }

  crearUsuario(): void {
    const dialogRef = this.dialog.open(UsuarioKallpaDialogComponent, {
      width: '600px',
      data: { usuario: null, mode: 'crear', grupos: this.grupos }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarios.push(result);
        this.aplicarFiltrosUsuarios();
      }
    });
  }

  editarUsuario(usuario: UsuarioKallpa): void {
    const dialogRef = this.dialog.open(UsuarioKallpaDialogComponent, {
      width: '600px',
      data: { usuario: { ...usuario }, mode: 'editar', grupos: this.grupos }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.usuarios.findIndex(u => u.usuario_id === result.usuario_id);
        if (index !== -1) {
          this.usuarios[index] = result;
          this.aplicarFiltrosUsuarios();
        }
      }
    });
  }

  eliminarUsuario(usuario: UsuarioKallpa): void {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombres} ${usuario.apellidos}?`)) {
      const index = this.usuarios.findIndex(u => u.usuario_id === usuario.usuario_id);
      if (index !== -1) {
        this.usuarios.splice(index, 1);
        this.aplicarFiltrosUsuarios();
      }
    }
  }

  getEstadoClass(estado: string): string {
    return estado === 'ACTIVO' ? 'estado-activo' : 'estado-inactivo';
  }

  // ===== GRUPOS =====
  aplicarFiltrosGrupos(): void {
    this.gruposFiltrados = this.grupos.filter(g => {
      const matchSearch = !this.searchTextGrupos ||
        g.nombre.toLowerCase().includes(this.searchTextGrupos.toLowerCase()) ||
        g.descripcion.toLowerCase().includes(this.searchTextGrupos.toLowerCase());

      return matchSearch;
    });
  }

  limpiarFiltrosGrupos(): void {
    this.searchTextGrupos = '';
    this.aplicarFiltrosGrupos();
  }

  crearGrupo(): void {
    const dialogRef = this.dialog.open(GrupoKallpaDialogComponent, {
      width: '550px',
      data: { grupo: null, mode: 'crear' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.grupos.push(result);
        this.aplicarFiltrosGrupos();
      }
    });
  }

  editarGrupo(grupo: GrupoKallpa): void {
    const dialogRef = this.dialog.open(GrupoKallpaDialogComponent, {
      width: '550px',
      data: { grupo: { ...grupo }, mode: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.grupos.findIndex(g => g.grupo_id === result.grupo_id);
        if (index !== -1) {
          this.grupos[index] = result;
          this.aplicarFiltrosGrupos();
        }
      }
    });
  }

  eliminarGrupo(grupo: GrupoKallpa): void {
    // Verificar si hay usuarios en este grupo
    const usuariosEnGrupo = this.usuarios.filter(u => u.grupo_id === grupo.grupo_id);
    if (usuariosEnGrupo.length > 0) {
      alert(`No se puede eliminar el grupo "${grupo.nombre}" porque tiene ${usuariosEnGrupo.length} usuario(s) asignado(s).`);
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el grupo ${grupo.nombre}?`)) {
      const index = this.grupos.findIndex(g => g.grupo_id === grupo.grupo_id);
      if (index !== -1) {
        this.grupos.splice(index, 1);
        this.aplicarFiltrosGrupos();
      }
    }
  }
}
