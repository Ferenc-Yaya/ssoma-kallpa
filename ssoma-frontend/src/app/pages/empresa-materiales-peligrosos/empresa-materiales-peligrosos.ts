import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmpresasService } from '../../core/services/empresas';
import { MaterialesPeligrososService, InventarioMatpel } from '../../core/services/materiales-peligrosos.service';
import { Empresa } from '../../mocks/empresas.mock';

@Component({
  selector: 'app-empresa-materiales-peligrosos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './empresa-materiales-peligrosos.html',
  styleUrl: './empresa-materiales-peligrosos.scss'
})
export class EmpresaMaterialesPeligrososComponent implements OnInit {
  empresa: Empresa | null = null;
  materiales: InventarioMatpel[] = [];
  loading: boolean = false;

  displayedColumns: string[] = ['nombre', 'codigo', 'clasificacion', 'cantidad', 'ubicacion', 'estado', 'acciones'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresasService: EmpresasService,
    private materialesService: MaterialesPeligrososService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const empresaId = this.route.snapshot.paramMap.get('id');
    if (empresaId) {
      this.loadEmpresa(Number(empresaId));
      this.loadMateriales(Number(empresaId));
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

  loadMateriales(empresaId: number): void {
    this.loading = true;
    this.materialesService.getInventariosByEmpresa(empresaId).subscribe({
      next: (materiales) => {
        this.materiales = materiales;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando materiales peligrosos:', error);
        this.showMessage('Error cargando materiales peligrosos', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  agregarMaterial(): void {
    this.showMessage('Funcionalidad de agregar material próximamente', 'success');
  }

  editarMaterial(material: InventarioMatpel): void {
    this.showMessage('Funcionalidad de editar próximamente', 'success');
  }

  verDocumentos(material: InventarioMatpel): void {
    if (!this.empresa) {
      this.showMessage('Error: No se pudo cargar la información de la empresa', 'error');
      return;
    }

    const ruta = ['/empresas', this.empresa.id, 'materiales-peligrosos', material.inventarioId, 'documentos'];
    this.router.navigate(ruta);
  }

  eliminarMaterial(material: InventarioMatpel): void {
    if (!material.inventarioId) return;

    if (confirm(`¿Está seguro de eliminar ${material.sustanciaNombre}?`)) {
      this.materialesService.deleteInventario(material.inventarioId).subscribe({
        next: () => {
          this.showMessage('Material eliminado exitosamente', 'success');
          if (this.empresa) {
            this.loadMateriales(this.empresa.id);
          }
        },
        error: (error) => {
          console.error('Error eliminando material:', error);
          this.showMessage('Error eliminando material', 'error');
        }
      });
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'ALMACENADO': return '#22c55e';
      case 'EN_USO': return '#f59e0b';
      case 'AGOTADO': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getMaterialesVigentes(): number {
    return this.materiales.filter(m => m.estado === 'ALMACENADO').length;
  }

  getMaterialesPorVencer(): number {
    return this.materiales.filter(m => m.estado === 'EN_USO').length;
  }

  getMaterialesVencidos(): number {
    return this.materiales.filter(m => m.estado === 'AGOTADO').length;
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
