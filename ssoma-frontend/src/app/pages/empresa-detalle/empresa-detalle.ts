import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresasService } from '../../core/services/empresas';
import { Empresa } from '../../mocks/empresas.mock';
import { EmpresaDialogComponent } from '../empresas/empresa-dialog/empresa-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

interface Trabajador {
  id: number;
  nombre: string;
  dni: string;
  cargo: string;
  estado: 'APTO' | 'OBSERVADO' | 'PENDIENTE';
}

@Component({
  selector: 'app-empresa-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './empresa-detalle.html',
  styleUrl: './empresa-detalle.scss'
})
export class EmpresaDetalleComponent implements OnInit {
  empresa: Empresa | undefined;
  trabajadores: Trabajador[] = [];
  displayedColumns: string[] = ['nombre', 'dni', 'cargo', 'estado', 'acciones'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresasService: EmpresasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmpresa(Number(id));
      this.loadTrabajadores(Number(id));
    }
  }

  loadEmpresa(id: number): void {
    console.log('Cargando empresa con ID:', id);
    this.empresasService.getEmpresaById(id).subscribe({
      next: (empresa) => {
        console.log('Empresa encontrada:', empresa);
        if (empresa) {
          this.empresa = empresa;
          this.cdr.detectChanges();
        } else {
          alert('Empresa no encontrada');
          this.router.navigate(['/empresas']);
        }
      },
      error: (error) => {
        console.error('Error al cargar empresa:', error);
        alert('Error al cargar empresa');
        this.router.navigate(['/empresas']);
      }
    });
  }

  loadTrabajadores(empresaId: number): void {
    this.trabajadores = [
      { id: 1, nombre: 'Juan Pérez García', dni: '43218765', cargo: 'Operador', estado: 'APTO' },
      { id: 2, nombre: 'María López Silva', dni: '45678912', cargo: 'Supervisor', estado: 'APTO' },
      { id: 3, nombre: 'Carlos Rojas Mendoza', dni: '41234567', cargo: 'Técnico', estado: 'OBSERVADO' }
    ];
  }

  toggleEstado(): void {
    if (!this.empresa) return;

    const nuevoEstado = this.empresa.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const titulo = nuevoEstado === 'ACTIVO' ? 'Activar Empresa' : 'Desactivar Empresa';
    const mensaje = nuevoEstado === 'ACTIVO' ? 
      '¿Está seguro de ACTIVAR esta empresa? Volverá a tener acceso al sistema.' : 
      '¿Está seguro de DESACTIVAR esta empresa? No podrá acceder al sistema hasta que sea reactivada.';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: titulo,
        message: mensaje,
        confirmText: nuevoEstado === 'ACTIVO' ? 'Activar' : 'Desactivar',
        cancelText: 'Cancelar',
        confirmColor: nuevoEstado === 'ACTIVO' ? 'primary' : 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.empresa) {
        this.empresasService.updateEmpresa(this.empresa.id, { estado: nuevoEstado }).subscribe({
          next: () => {
            this.showMessage(
              `Empresa ${nuevoEstado === 'ACTIVO' ? 'activada' : 'desactivada'} exitosamente`,
              'success'
            );
            this.loadEmpresa(this.empresa!.id);
          },
          error: () => {
            this.showMessage('Error al cambiar estado de empresa', 'error');
          }
        });
      }
    });
  }

  editarEmpresa(): void {
    if (!this.empresa) return;

    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '500px',
      data: { empresa: this.empresa }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresasService.updateEmpresa(this.empresa!.id, result).subscribe({
          next: () => {
            this.showMessage('Empresa actualizada exitosamente', 'success');
            this.loadEmpresa(this.empresa!.id);
          },
          error: () => {
            this.showMessage('Error al actualizar empresa', 'error');
          }
        });
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
  verPersonal(): void {
  if (!this.empresa) return;
  this.router.navigate(['/empresas', this.empresa.id, 'personal']);
  }
  
  verActivos(): void {
    if (!this.empresa) return;
    this.router.navigate(['/empresas', this.empresa.id, 'activos']);
  }
}