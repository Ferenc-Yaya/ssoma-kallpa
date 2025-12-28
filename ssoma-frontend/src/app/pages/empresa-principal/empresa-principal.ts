import { Component, OnInit } from '@angular/core';
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
import { EmpresaDialogComponent } from './empresa-dialog/empresa-dialog';
import { SedeDialogComponent } from './sede-dialog/sede-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

interface EmpresaPrincipal {
  empresaId: number;
  tenantId: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  plan: string;
  cantidadSedes: number;
  sedes?: Sede[];
}

interface Sede {
  sedeId: number;
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
  displayedColumns: string[] = ['tenantId', 'razonSocial', 'ruc', 'plan', 'cantidadSedes', 'estado', 'acciones'];
  displayedColumnsSedes: string[] = ['nombre', 'direccion', 'esPrincipal', 'activo', 'acciones'];
  expandedEmpresa: EmpresaPrincipal | null = null;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmpresasPrincipales();
  }

  loadEmpresasPrincipales(): void {
    // TODO: Replace with real API call to get all empresas with tipo='HOST'
    this.empresasPrincipales = [
      {
        empresaId: 1,
        tenantId: 'KALLPA',
        ruc: '20123456789',
        razonSocial: 'KALLPA SAC',
        direccion: 'Av. Principal Kallpa, Lima',
        telefono: '01-1234567',
        email: 'contacto@kallpa.com',
        estado: 'ACTIVO',
        plan: 'ENTERPRISE',
        cantidadSedes: 2,
        sedes: [
          {
            sedeId: 1,
            nombre: 'Cerro del Águila',
            direccion: 'Central Hidroeléctrica Cerro del Águila, Huancavelica',
            esPrincipal: true,
            activo: true
          },
          {
            sedeId: 2,
            nombre: 'Cañón del Pato',
            direccion: 'Central Hidroeléctrica Cañón del Pato, Áncash',
            esPrincipal: false,
            activo: true
          }
        ]
      },
      {
        empresaId: 2,
        tenantId: 'SYSTEM',
        ruc: '20999999999',
        razonSocial: 'Sistema Central',
        direccion: 'Av. Sistema Central, Lima',
        telefono: '01-9999999',
        email: 'admin@system.com',
        estado: 'ACTIVO',
        plan: 'ENTERPRISE',
        cantidadSedes: 1,
        sedes: [
          {
            sedeId: 3,
            nombre: 'Sede Central',
            direccion: 'Oficina Principal, Lima',
            esPrincipal: true,
            activo: true
          }
        ]
      }
    ];
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
    // TODO: Reemplazar con llamada al API
    const newEmpresa: EmpresaPrincipal = {
      empresaId: this.empresasPrincipales.length + 1,
      tenantId: data.tenantId,
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email,
      estado: data.estado,
      plan: data.plan,
      cantidadSedes: 0,
      sedes: []
    };

    this.empresasPrincipales.push(newEmpresa);
    this.showNotification('Empresa principal creada exitosamente', 'success');
  }

  updateEmpresa(empresa: EmpresaPrincipal, data: any): void {
    // TODO: Reemplazar con llamada al API
    const index = this.empresasPrincipales.findIndex(e => e.empresaId === empresa.empresaId);
    if (index !== -1) {
      this.empresasPrincipales[index] = {
        ...this.empresasPrincipales[index],
        razonSocial: data.razonSocial,
        ruc: data.ruc,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
        plan: data.plan,
        estado: data.estado
      };
      this.showNotification('Empresa principal actualizada exitosamente', 'success');
    }
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
        // TODO: Reemplazar con llamada al API
        const index = this.empresasPrincipales.findIndex(e => e.empresaId === empresa.empresaId);
        if (index !== -1) {
          this.empresasPrincipales.splice(index, 1);
          this.showNotification('Empresa principal eliminada exitosamente', 'success');
        }
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
      sedeId: empresa.sedes.length + 1,
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
