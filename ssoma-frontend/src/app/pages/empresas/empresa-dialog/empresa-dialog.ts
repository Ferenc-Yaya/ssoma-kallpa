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

import {
  Empresa,
  EmpresaContacto,
  TipoContratista,
  CreateEmpresaDto,
  UpdateEmpresaDto
} from '../../../core/models/empresa.model';
import { TipoContacto } from '../../../core/enums';
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

  // Form data - Usamos Partial para el formulario en edición
  empresaForm: Partial<Empresa> & {
    empresaId?: string;
    tenantId: string;
    ruc: string;
    razonSocial: string;
    tipoId?: string;
    direccion: string;
    telefono: string;
    email: string;
    logoUrl?: string | null;
    sitioWeb?: string | null;
    rubroComercial?: string | null;
    activo: boolean;
  };

  isEdit: boolean;
  tiposContratista: TipoContratista[] = [];
  contactos: EmpresaContacto[] = [];

  // Variables para manejo de logo
  logoPreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<EmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empresa?: any; tenantId?: string },
    private tiposContratistaService: TiposContratistaService,
    private cdr: ChangeDetectorRef
  ) {
    this.isEdit = !!data.empresa;

    if (this.isEdit && data.empresa) {
      // Modo edición - clonamos los datos
      this.empresaForm = {
        empresaId: data.empresa.empresaId || data.empresa.id,
        tenantId: data.empresa.tenantId,
        ruc: data.empresa.ruc,
        razonSocial: data.empresa.razonSocial,
        tipoId: data.empresa.tipoId || data.empresa.tipo_contratista_id,
        direccion: data.empresa.direccion || '',
        telefono: data.empresa.telefono || '',
        email: data.empresa.email || '',
        logoUrl: data.empresa.logoUrl || null,
        sitioWeb: data.empresa.sitioWeb || null,
        rubroComercial: data.empresa.rubroComercial || null,
        activo: data.empresa.activo !== undefined ? data.empresa.activo : true
      };
      this.contactos = data.empresa.contactos ? [...data.empresa.contactos] : [];

      // Preview del logo si existe
      if (this.empresaForm.logoUrl) {
        this.logoPreview = this.empresaForm.logoUrl;
      }
    } else {
      // Modo creación - inicializar con valores por defecto
      this.empresaForm = {
        tenantId: data.tenantId || '',
        ruc: '',
        razonSocial: '',
        tipoId: undefined,
        direccion: '',
        telefono: '',
        email: '',
        logoUrl: null,
        sitioWeb: null,
        rubroComercial: null,
        activo: true
      };
      this.contactos = [];
    }
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
    const nuevoContacto: Partial<EmpresaContacto> = {
      nombreCompleto: '',
      cargo: '',
      telefono: null,
      email: null,
      tipoContacto: TipoContacto.COMERCIAL,
      esPrincipal: this.contactos.length === 0
    };
    this.contactos.push(nuevoContacto as EmpresaContacto);
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
      this.empresaForm.razonSocial?.trim() &&
      this.empresaForm.ruc?.trim() &&
      this.empresaForm.ruc.length === 11 &&
      this.empresaForm.tipoId
    );
    return empresaValida;
  }

  onSave(): void {
    if (this.isValid()) {
      const result: any = {
        ...this.empresaForm,
        contactos: this.contactos
      };

      // Agregar el archivo seleccionado si existe
      if (this.selectedFile) {
        result.logoFile = this.selectedFile;
      }

      this.dialogRef.close(result);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen');
        input.value = ''; // Limpiar input
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no debe superar 5MB');
        input.value = ''; // Limpiar input
        return;
      }

      this.selectedFile = file;

      // Crear preview inmediatamente
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
        this.cdr.detectChanges(); // Forzar detección de cambios
      };
      reader.readAsDataURL(file);
    }

    // Limpiar el input para que se pueda seleccionar el mismo archivo de nuevo
    input.value = '';
  }

  removeLogo(): void {
    this.selectedFile = null;
    this.logoPreview = null;
    this.empresaForm.logoUrl = null;
  }
}