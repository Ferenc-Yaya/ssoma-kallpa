import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivosService } from '../../core/services/activos.service';
import { EmpresasService } from '../../core/services/empresas';
import { Empresa } from '../../mocks/empresas.mock';
import { Activo } from '../../mocks/activos.mock';

@Component({
  selector: 'app-empresa-activos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './empresa-activos.html',
  styleUrl: './empresa-activos.scss'
})
export class EmpresaActivosComponent implements OnInit {
  empresa: Empresa | null = null;
  activos: Activo[] = [];
  vehiculos: Activo[] = [];
  herramientas: Activo[] = [];
  loading: boolean = false;

  displayedColumns: string[] = ['codigo', 'descripcion', 'marca', 'modelo', 'estado', 'documentos', 'acciones'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activosService: ActivosService,
    private empresasService: EmpresasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const empresaId = this.route.snapshot.paramMap.get('id');
    if (empresaId) {
      this.loadEmpresa(Number(empresaId));
      this.loadActivos(Number(empresaId));
    }
  }

  loadEmpresa(empresaId: number): void {
    this.empresasService.getEmpresaById(empresaId).subscribe({
      next: (empresa) => {
        this.empresa = empresa || null;
        this.cdr.detectChanges();
      }
    });
  }

  loadActivos(empresaId: number): void {
    this.loading = true;
    this.activosService.getActivosByEmpresa(empresaId).subscribe({
      next: (data) => {
        this.activos = [...data];
        this.vehiculos = data.filter(a => a.tipo_activo === 'VEHICULO');
        this.herramientas = data.filter(a => a.tipo_activo === 'HERRAMIENTA');
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.showMessage('Error al cargar activos', 'error');
      }
    });
  }

  agregarActivo(tipo: 'VEHICULO' | 'HERRAMIENTA'): void {
    // TODO: Abrir diálogo
    this.showMessage(`Funcionalidad de agregar ${tipo} próximamente`, 'success');
  }

  editarActivo(activo: Activo): void {
    // TODO: Abrir diálogo
    this.showMessage('Funcionalidad de editar próximamente', 'success');
  }

  verDocumentos(activo: Activo): void {
    if (!this.empresa) {
      this.showMessage('Error: No se pudo cargar la información de la empresa', 'error');
      return;
    }

    const ruta = ['/empresas', this.empresa.id, 'activos', activo.activo_id, 'documentos'];
    this.router.navigate(ruta);
  }

  eliminarActivo(activo: Activo): void {
    if (confirm(`¿Está seguro de eliminar ${activo.descripcion}?`)) {
      this.activosService.deleteActivo(activo.activo_id).subscribe({
        next: (success) => {
          if (success) {
            this.showMessage('Activo eliminado exitosamente', 'success');
            this.loadActivos(this.empresa!.id);
          }
        },
        error: () => {
          this.showMessage('Error al eliminar activo', 'error');
        }
      });
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'OPERATIVO': return '#22c55e';
      case 'MANTENIMIENTO': return '#f59e0b';
      case 'FUERA_SERVICIO': return '#ef4444';
      default: return '#6b7280';
    }
  }

  volver(): void {
    this.router.navigate(['/empresas', this.empresa?.id]);
  }

  private showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}