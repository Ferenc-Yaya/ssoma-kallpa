import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmpresaService, EmpresaDTO } from '../../core/services/empresa.service';
import { UsuariosService, Usuario } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-dashboard-superadmin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './dashboard-superadmin.html',
  styleUrl: './dashboard-superadmin.scss'
})
export class DashboardSuperadminComponent implements OnInit {
  empresasPrincipales: EmpresaDTO[] = [];
  empresasContratistas: EmpresaDTO[] = [];
  usuarios: Usuario[] = [];

  // Contadores
  totalEmpresasPrincipales: number = 0;
  totalContratistas: number = 0;
  totalUsuarios: number = 0;

  loading: boolean = true;

  constructor(
    private empresaService: EmpresaService,
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    forkJoin({
      empresas: this.empresaService.getAllEmpresas(),
      usuarios: this.usuariosService.getAllUsuarios()
    }).subscribe({
      next: ({ empresas, usuarios }) => {
        // Filtrar empresas principales (tipoNombre contiene 'Principal' o 'HOST')
        this.empresasPrincipales = empresas.filter(e =>
          e.tipoNombre?.toLowerCase().includes('principal') ||
          e.tipoNombre?.toLowerCase().includes('host')
        );

        // El resto son contratistas
        this.empresasContratistas = empresas.filter(e =>
          !e.tipoNombre?.toLowerCase().includes('principal') &&
          !e.tipoNombre?.toLowerCase().includes('host')
        );

        this.totalEmpresasPrincipales = this.empresasPrincipales.length;
        this.totalContratistas = this.empresasContratistas.length;

        // Usuarios
        this.usuarios = usuarios;
        this.totalUsuarios = usuarios.length;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
