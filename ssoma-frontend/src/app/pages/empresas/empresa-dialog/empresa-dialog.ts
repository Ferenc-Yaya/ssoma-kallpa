import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

// VERIFICA QUE ESTA RUTA SEA LA CORRECTA EN TU PROYECTO
import { Empresa, EmpresaContacto, TipoContratista } from '../../../core/models/empresa.model';
import { TiposContratistaService } from '../../../core/services/tipos-contratista.service';

@Component({
  selector: 'app-empresa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './empresa-dialog.html',
  styleUrls: ['./empresa-dialog.scss']
})
export class EmpresaDialogComponent implements OnInit {

  // === AQUÍ ESTABA EL ERROR ===
  // Antes tenías: empresa: Partial<Empresa> & { ... }
  // AHORA TIENE QUE SER ASÍ:
  empresa: Empresa; 
  // ============================

  isEdit: boolean;
  tiposContratista: TipoContratista[] = [];
  contactos: EmpresaContacto[] = [];

  constructor(
    public dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empresa?: Empresa; tenantId?: string },
    private tiposContratistaService: TiposContratistaService,
    private cdr: ChangeDetectorRef
  ) {
    this.isEdit = !!data.empresa;

    if (this.isEdit && data.empresa) {
      // Clonamos para editar
      this.empresa = { ...data.empresa };
    } else {
      // INICIALIZAMOS TODO PARA QUE NO FALLE EL HTML
      // Usamos 'as Empresa' para forzar el tipo y evitar errores de TypeScript iniciales
      this.empresa = {
        empresaId: '',
        tenantId: data.tenantId || '',
        ruc: '',
        razonSocial: '',
        tipoId: undefined, // El usuario lo seleccionará
        direccion: '',
        telefono: '',
        email: '',
        
        // CAMPOS NUEVOS (Los que daban error)
        logoUrl: '',
        sitioWeb: '',
        rubroComercial: '',
        
        activo: true,
        contactos: [],
        sedes: []
      } as Empresa; 
    }

    // Inicializamos contactos
    this.contactos = this.empresa.contactos ? [...this.empresa.contactos] : [];
  }

  ngOnInit(): void {
    this.loadTiposContratista();
  }

  loadTiposContratista(): void {
      this.tiposContratistaService.getAll().subscribe({
        next: (tipos: any[]) => { 
          
          const listaTipos = tipos as any[]; 

          if (this.data.tenantId) {
            this.tiposContratista = listaTipos.filter(t => 
              t.codigo !== 'HOST' && t.nombre !== 'Empresa Principal'
            );
          } else {
            this.tiposContratista = listaTipos;
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error cargando tipos:', error);
        }
      });
    }

  agregarContacto(): void {
    const nuevoContacto: EmpresaContacto = {
      nombreCompleto: '', 
      cargo: '',
      telefono: '',
      email: '',
      tipoContacto: 'COMERCIAL',
      esPrincipal: this.contactos.length === 0,
      tenantId: this.empresa.tenantId
    };
    this.contactos.push(nuevoContacto);
  }

  eliminarContacto(index: number): void {
    this.contactos.splice(index, 1);
    if (this.contactos.length > 0 && !this.contactos.some(c => c.esPrincipal)) {
      this.contactos[0].esPrincipal = true;
    }
  }

  onPrincipalChange(index: number): void {
    if (this.contactos[index].esPrincipal) {
      this.contactos.forEach((c, i) => {
        if (i !== index) c.esPrincipal = false;
      });
    }
  }

  isValid(): boolean {
    // Validamos campos obligatorios
    const empresaValida = !!(
      this.empresa.razonSocial?.trim() &&
      this.empresa.ruc?.trim() &&
      this.empresa.ruc.length === 11 &&
      this.empresa.tipoId
    );
    return empresaValida;
  }

  onSave(): void {
    if (this.isValid()) {
      this.empresa.contactos = this.contactos;
      this.dialogRef.close(this.empresa);
    }
  }
}