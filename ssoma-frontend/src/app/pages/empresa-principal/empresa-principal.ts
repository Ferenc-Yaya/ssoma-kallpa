import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { EmpresaService, EmpresaDTO } from '../../core/services/empresa.service';
import { SedeService, SedeDTO } from '../../core/services/sede.service';
import { EmpresaDialogComponent } from './empresa-dialog/empresa-dialog';
import { SedeDialogComponent } from './sede-dialog/sede-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

interface EmpresaPrincipal {
  empresaId: string;
  tenantId: string;
  ruc: string;
  razonSocial: string;
  tipo: string;
  direccion: string;
  telefono: string;
  email: string;
  logoUrl: string;
  sitioWeb: string;
  rubroComercial: string;
  scoreSeguridad: number;
  estadoHabilitacion: string;
  activo: boolean;
  cantidadSedes: number;
  createdAt: string;
  sedes?: Sede[];
}

interface Sede {
  sedeId: string;
  nombre: string;
  direccion: string;
  esPrincipal: boolean;
  activo: boolean;
}

@Component({
  selector: 'app-empresa-principal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './empresa-principal.html',
  styleUrl: './empresa-principal.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EmpresaPrincipalComponent implements OnInit {
  empresasPrincipales: EmpresaPrincipal[] = [];
  displayedColumns: string[] = ['tenantId', 'razonSocial', 'ruc', 'cantidadSedes', 'estadoHabilitacion', 'acciones'];
  displayedColumnsSedes: string[] = ['nombre', 'direccion', 'esPrincipal', 'activo', 'acciones'];
  expandedEmpresa: EmpresaPrincipal | null = null;
  loading: boolean = false;
  tipoHostId: string | null = null; // ID del tipo 'HOST' para crear nuevas empresas principales

  constructor(
    private authService: AuthService,
    private empresaService: EmpresaService,
    private sedeService: SedeService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmpresasPrincipales();
  }

  loadEmpresasPrincipales(): void {
    console.log('🔄 Iniciando carga de empresas principales...');
    console.log('🔑 Token:', localStorage.getItem('auth_token')?.substring(0, 50) + '...');
    console.log('🏢 Tenant:', localStorage.getItem('current_tenant'));

    this.loading = true;
    this.empresaService.getAllEmpresas().subscribe({
      next: (empresas: EmpresaDTO[]) => {
        try {
          console.log('📦 Empresas recibidas del backend:', empresas);

          // Filtrar solo empresas principales (codigo='HOST')
          const empresasPrincipales = empresas.filter(e =>
            e.tipo === 'HOST'
          );

          console.log('✅ Empresas principales filtradas:', empresasPrincipales);

          // Guardar tipoId de HOST para crear nuevas empresas
          if (empresasPrincipales.length > 0 && empresasPrincipales[0].tipoId) {
            this.tipoHostId = empresasPrincipales[0].tipoId;
          }

          // Mapear a la interfaz local
          this.empresasPrincipales = empresasPrincipales.map(e => ({
            empresaId: e.id,
            tenantId: e.tenantId,
            ruc: e.ruc,
            razonSocial: e.razonSocial,
            tipo: e.tipo,
            direccion: e.direccion || '',
            telefono: e.telefono || '',
            email: e.email || '',
            logoUrl: e.logoUrl || '',
            sitioWeb: e.sitioWeb || '',
            rubroComercial: e.rubroComercial || '',
            scoreSeguridad: e.scoreSeguridad || 100,
            estadoHabilitacion: e.estadoHabilitacion,
            activo: e.activo,
            cantidadSedes: 0,
            createdAt: e.createdAt || '',
            sedes: []
          }));

          console.log('✅ Empresas mapeadas:', this.empresasPrincipales);

          // Cargar sedes para cada empresa
          this.empresasPrincipales.forEach(empresa => {
            this.loadSedesForEmpresa(empresa);
          });

          this.loading = false;
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error en el procesamiento:', error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar empresas principales:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error completo:', JSON.stringify(error, null, 2));
        this.showNotification('Error al cargar empresas principales', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSedesForEmpresa(empresa: EmpresaPrincipal): void {
    this.sedeService.getSedesByEmpresa(empresa.empresaId).subscribe({
      next: (sedes: SedeDTO[]) => {
        empresa.sedes = sedes.map(s => ({
          sedeId: s.id,
          nombre: s.nombre,
          direccion: s.direccion,
          esPrincipal: s.esPrincipal,
          activo: s.activo
        }));
        empresa.cantidadSedes = sedes.length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar sedes para empresa:', empresa.empresaId, error);
        empresa.cantidadSedes = 0;
        empresa.sedes = [];
      }
    });
  }

  toggleEmpresa(empresa: EmpresaPrincipal): void {
    this.expandedEmpresa = this.expandedEmpresa === empresa ? null : empresa;
  }

  openEmpresaDialog(empresa?: EmpresaPrincipal): void {
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '650px',
      data: {
        empresa: empresa,
        isEdit: !!empresa
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (empresa) {
          // Editar empresa existente
          this.updateEmpresa(empresa, result);
        } else {
          // Crear nueva empresa
          this.createEmpresa(result);
        }
      }
    });
  }

  createEmpresa(data: any): void {
    // Agregar tipoId de HOST al request
    const request = {
      ...data,
      tipoId: this.tipoHostId
    };

    this.empresaService.createEmpresa(request).subscribe({
      next: (empresa: EmpresaDTO) => {
        this.showNotification('Empresa principal creada exitosamente', 'success');
        this.loadEmpresasPrincipales(); // Recargar lista
      },
      error: (error) => {
        console.error('Error al crear empresa:', error);
        const errorMsg = error?.error?.message || 'Error al crear empresa principal';
        this.showNotification(errorMsg, 'error');
      }
    });
  }

  updateEmpresa(empresa: EmpresaPrincipal, data: any): void {
    this.empresaService.updateEmpresa(empresa.empresaId, data).subscribe({
      next: (empresaActualizada: EmpresaDTO) => {
        this.showNotification('Empresa principal actualizada exitosamente', 'success');
        this.loadEmpresasPrincipales(); // Recargar lista
      },
      error: (error) => {
        console.error('Error al actualizar empresa:', error);
        this.showNotification('Error al actualizar empresa principal', 'error');
      }
    });
  }

  deleteEmpresa(empresa: EmpresaPrincipal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Eliminar Empresa Principal',
        message: `¿Está seguro de eliminar la empresa "${empresa.razonSocial}" (${empresa.tenantId})? Esta acción no se puede deshacer y se eliminarán todas las sedes asociadas.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.empresaService.deleteEmpresa(empresa.empresaId).subscribe({
          next: () => {
            this.showNotification('Empresa principal eliminada exitosamente', 'success');
            this.loadEmpresasPrincipales(); // Recargar lista
          },
          error: (error) => {
            console.error('Error al eliminar empresa:', error);
            this.showNotification('Error al eliminar empresa principal', 'error');
          }
        });
      }
    });
  }

  viewEmpresaDetail(empresa: EmpresaPrincipal): void {
    // Navegar a la vista de empresas con el ID del tenant
    this.router.navigate(['/empresas'], {
      queryParams: { tenant: empresa.tenantId }
    });
  }

  openSedeDialog(empresa: EmpresaPrincipal, sede?: Sede): void {
    const dialogRef = this.dialog.open(SedeDialogComponent, {
      width: '600px',
      data: {
        sede: sede,
        isEdit: !!sede,
        empresaNombre: empresa.razonSocial
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (sede) {
          // Editar sede existente
          this.updateSede(empresa, sede, result);
        } else {
          // Crear nueva sede
          this.createSede(empresa, result);
        }
      }
    });
  }

  createSede(empresa: EmpresaPrincipal, data: any): void {
    // TODO: Reemplazar con llamada al API
    if (!empresa.sedes) {
      empresa.sedes = [];
    }

    const newSede: Sede = {
      sedeId: crypto.randomUUID(), // Generar UUID temporal
      nombre: data.nombre,
      direccion: data.direccion,
      esPrincipal: data.esPrincipal,
      activo: data.activo
    };

    empresa.sedes.push(newSede);
    empresa.cantidadSedes = empresa.sedes.length;
    this.showNotification('Sede creada exitosamente', 'success');
  }

  updateSede(empresa: EmpresaPrincipal, sede: Sede, data: any): void {
    // TODO: Reemplazar con llamada al API
    if (empresa.sedes) {
      const index = empresa.sedes.findIndex(s => s.sedeId === sede.sedeId);
      if (index !== -1) {
        empresa.sedes[index] = {
          ...empresa.sedes[index],
          nombre: data.nombre,
          direccion: data.direccion,
          esPrincipal: data.esPrincipal,
          activo: data.activo
        };
        this.showNotification('Sede actualizada exitosamente', 'success');
      }
    }
  }

  deleteSede(empresa: EmpresaPrincipal, sede: Sede): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Eliminar Sede',
        message: `¿Está seguro de eliminar la sede "${sede.nombre}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // TODO: Reemplazar con llamada al API
        if (empresa.sedes) {
          const index = empresa.sedes.findIndex(s => s.sedeId === sede.sedeId);
          if (index !== -1) {
            empresa.sedes.splice(index, 1);
            empresa.cantidadSedes = empresa.sedes.length;
            this.showNotification('Sede eliminada exitosamente', 'success');
          }
        }
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
