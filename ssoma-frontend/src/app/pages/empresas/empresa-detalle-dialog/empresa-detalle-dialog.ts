import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Empresa } from '../../../core/models/empresa.model';
import { TiposContratistaService, TipoContratista } from '../../../core/services/tipos-contratista.service';

@Component({
  selector: 'app-empresa-detalle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSliderModule,
    MatTooltipModule
  ],
  templateUrl: './empresa-detalle-dialog.html',
  styleUrl: './empresa-detalle-dialog.scss'
})
export class EmpresaDetalleDialogComponent implements OnInit {
  empresaForm: FormGroup;
  logoPreview: string | null = null;
  tiposContratista: TipoContratista[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private tiposContratistaService: TiposContratistaService,
    public dialogRef: MatDialogRef<EmpresaDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empresa: Empresa }
  ) {
    this.empresaForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadTiposContratista();
    this.loadEmpresaData();
  }

  loadTiposContratista(): void {
    this.tiposContratistaService.getAll().subscribe({
      next: (tipos) => {
        this.tiposContratista = tipos;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar tipos de contratista:', error);
      }
    });
  }

  loadEmpresaData(): void {
    const empresa = this.data.empresa;

    this.empresaForm.patchValue({
      razonSocial: empresa.razonSocial,
      ruc: empresa.ruc,
      tipoId: empresa.tipoId,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      email: empresa.email,
      logoUrl: empresa.logoUrl,
      sitioWeb: empresa.sitioWeb,
      rubroComercial: empresa.rubroComercial,
      scoreSeguridad: empresa.scoreSeguridad || 0,
      activo: empresa.activo
    });

    // Cargar contactos existentes
    if (empresa.contactos && empresa.contactos.length > 0) {
      empresa.contactos.forEach((contacto: any) => {
        this.addContacto(contacto);
      });
    }

    if (empresa.logoUrl) {
      this.logoPreview = empresa.logoUrl;
    }

    // Deshabilitar todo el formulario
    this.empresaForm.disable();
  }

  createForm(): FormGroup {
    return this.fb.group({
      razonSocial: [''],
      ruc: [''],
      tipoId: [''],
      direccion: [''],
      telefono: [''],
      email: [''],
      logoUrl: [''],
      sitioWeb: [''],
      rubroComercial: [''],
      scoreSeguridad: [0],
      activo: [true],
      contactos: this.fb.array([])
    });
  }

  get contactos(): FormArray {
    return this.empresaForm.get('contactos') as FormArray;
  }

  addContacto(contacto?: any): void {
    const contactoGroup = this.fb.group({
      nombreCompleto: [contacto?.nombreCompleto || contacto?.nombre || ''],
      cargo: [contacto?.cargo || ''],
      telefono: [contacto?.telefono || ''],
      email: [contacto?.email || '']
    });
    contactoGroup.disable();
    this.contactos.push(contactoGroup);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  formatScore(value: number): string {
    return `${value}`;
  }

  getScoreValue(): number {
    return this.empresaForm.get('scoreSeguridad')?.value || 0;
  }
}
