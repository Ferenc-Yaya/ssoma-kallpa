import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ← AGREGAR ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EmpresasService } from '../../core/services/empresas';
import { Empresa } from '../../mocks/empresas.mock';
import { EmpresaDialogComponent } from '../empresas/empresa-dialog/empresa-dialog';

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
    private cdr: ChangeDetectorRef  // ← AGREGAR ESTO
  ) {
    console.log('Constructor ejecutado');
  }

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID capturado:', id);
    this.loadEmpresa(id);
    this.loadTrabajadores(id);
  }

  loadEmpresa(id: number): void {
    console.log('Buscando empresa con ID:', id);
    this.empresasService.getEmpresaById(id).subscribe({
      next: (empresa) => {
        console.log('Empresa encontrada:', empresa);
        if (empresa) {
          this.empresa = empresa;
          this.cdr.detectChanges();  // ← AGREGAR ESTO - FUERZA LA ACTUALIZACIÓN DE LA VISTA
          console.log('Vista actualizada con empresa:', this.empresa);
        } else {
          console.log('Empresa no existe');
          alert('Empresa no encontrada');
          this.router.navigate(['/empresas']);
        }
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al cargar la empresa');
        this.router.navigate(['/empresas']);
      }
    });
  }

  loadTrabajadores(empresaId: number): void {
    console.log('Cargando trabajadores para empresa:', empresaId);
    this.trabajadores = [
      { id: 1, nombre: 'Juan Pérez García', dni: '43218765', cargo: 'Operador', estado: 'APTO' },
      { id: 2, nombre: 'María López Silva', dni: '45678912', cargo: 'Supervisor', estado: 'APTO' },
      { id: 3, nombre: 'Carlos Rojas Mendoza', dni: '41234567', cargo: 'Técnico', estado: 'PENDIENTE' }
    ];
  }

  editarEmpresa(): void {
    if (!this.empresa) return;

    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '500px',
      data: { empresa: this.empresa }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.empresa) {
        this.empresasService.updateEmpresa(this.empresa.id, result).subscribe({
          next: () => {
            this.loadEmpresa(this.empresa!.id);
          }
        });
      }
    });
  }
}