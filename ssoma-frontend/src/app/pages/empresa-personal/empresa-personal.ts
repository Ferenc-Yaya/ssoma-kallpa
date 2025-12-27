import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonasService } from '../../core/services/personas.service';
import { EmpresasService } from '../../core/services/empresas';
import { Persona } from '../../mocks/personas.mock';
import { Empresa } from '../../mocks/empresas.mock';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { PersonaDialogComponent } from './persona-dialog/persona-dialog';

@Component({
  selector: 'app-empresa-personal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './empresa-personal.html',
  styleUrl: './empresa-personal.scss'
})
export class EmpresaPersonalComponent implements OnInit {
  empresa: Empresa | undefined;
  personas: Persona[] = [];
  personasFiltradas: Persona[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['foto', 'nombres', 'documento', 'cargo', 'estado', 'acciones'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personasService: PersonasService,
    private empresasService: EmpresasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const empresaId = this.route.snapshot.paramMap.get('id');
    if (empresaId) {
      this.loadEmpresa(Number(empresaId));
      this.loadPersonal(Number(empresaId));
    }
  }

  loadEmpresa(id: number): void {
    this.empresasService.getEmpresaById(id).subscribe({
      next: (empresa) => {
        if (empresa) {
          this.empresa = empresa;
          this.cdr.detectChanges();
        } else {
          this.router.navigate(['/empresas']);
        }
      },
      error: () => {
        this.router.navigate(['/empresas']);
      }
    });
  }

  loadPersonal(empresaId: number): void {
    this.personasService.getPersonasByEmpresa(empresaId).subscribe({
      next: (personas) => {
        this.personas = personas;
        this.personasFiltradas = personas;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar personal:', error);
        this.showMessage('Error al cargar personal', 'error');
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.personasFiltradas = this.personas;
    } else {
      this.personasFiltradas = this.personas.filter(p =>
        p.nombres.toLowerCase().includes(term) ||
        p.apellidos.toLowerCase().includes(term) ||
        p.numero_documento.includes(term) ||
        p.cargo.toLowerCase().includes(term)
      );
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PersonaDialogComponent, {
      width: '1100px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        mode: 'create',
        empresaId: this.empresa!.id,
        empresaNombre: this.empresa?.razonSocial
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personasService.createPersona(result).subscribe({
          next: () => {
            this.showMessage('Trabajador agregado exitosamente', 'success');
            this.loadPersonal(this.empresa!.id);
          },
          error: () => {
            this.showMessage('Error al agregar trabajador', 'error');
          }
        });
      }
    });
  }

  openEditDialog(persona: Persona): void {
    const dialogRef = this.dialog.open(PersonaDialogComponent, {
      width: '1100px',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        mode: 'edit',
        persona: persona,
        empresaId: this.empresa!.id,
        empresaNombre: this.empresa?.razonSocial
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personasService.updatePersona(result.persona_id, result).subscribe({
          next: () => {
            this.showMessage('Trabajador actualizado exitosamente', 'success');
            this.loadPersonal(this.empresa!.id);
          },
          error: () => {
            this.showMessage('Error al actualizar trabajador', 'error');
          }
        });
      }
    });
  }

  verPasaporte(persona: Persona): void {
    this.router.navigate(['/pasaporte', persona.persona_id]);
  }

  verDocumentos(persona: Persona): void {
    this.router.navigate(['/empresas', this.empresa!.id, 'personal', persona.persona_id, 'documentos']);
  }

  deletePersona(persona: Persona): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Trabajador',
        message: `¿Está seguro de eliminar a ${persona.nombres} ${persona.apellidos}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personasService.deletePersona(persona.persona_id).subscribe({
          next: (success) => {
            if (success) {
              this.showMessage('Trabajador eliminado exitosamente', 'success');
              this.loadPersonal(this.empresa!.id);
            }
          },
          error: () => {
            this.showMessage('Error al eliminar trabajador', 'error');
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
}