import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { EmpresaService } from '../../core/services/empresa.service';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-mi-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './mi-empresa.html',
  styleUrl: './mi-empresa.scss'
})
export class MiEmpresaComponent implements OnInit {
  empresaForm: FormGroup;
  loading = true;
  saving = false;
  empresaId: string = '';

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.empresaForm = this.fb.group({
      ruc: [{ value: '', disabled: true }],
      razonSocial: ['', [Validators.required, Validators.maxLength(200)]],
      direccion: ['', [Validators.required, Validators.maxLength(300)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      sitioWeb: ['', [Validators.maxLength(200)]],
      rubroComercial: ['', [Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    console.log('🚀 MiEmpresaComponent inicializado');
    this.cargarDatosEmpresa();
  }

  cargarDatosEmpresa(): void {
    const empresaIdUsuario = this.authService.getEmpresaId();
    console.log('🏢 Mi Empresa - empresaId del usuario:', empresaIdUsuario);

    // Si el usuario tiene empresaId asignado, cargar directamente esa empresa
    if (empresaIdUsuario) {
      this.empresaService.getEmpresaById(empresaIdUsuario).subscribe({
        next: (empresa) => {
          console.log('✅ Mi Empresa - Cargando empresa:', empresa.razonSocial);
          this.empresaId = empresa.id;
          this.empresaForm.patchValue({
            ruc: empresa.ruc,
            razonSocial: empresa.razonSocial,
            direccion: empresa.direccion || '',
            telefono: empresa.telefono || '',
            email: empresa.email || '',
            sitioWeb: empresa.sitioWeb || '',
            rubroComercial: empresa.rubroComercial || ''
          });
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Mi Empresa - Error al cargar:', err);
          this.snackBar.open('Error al cargar los datos de la empresa', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Fallback: buscar empresas y filtrar excluyendo HOST
      this.empresaService.getAllEmpresas().subscribe({
        next: (empresas) => {
          console.log('📦 Mi Empresa - Empresas recibidas:', empresas);
          if (empresas && empresas.length > 0) {
            // Filtrar para excluir la empresa principal (tipo HOST)
            const empresasContratista = empresas.filter(e =>
              e.tipoNombre !== 'HOST' &&
              e.tipoNombre !== 'Empresa Principal'
            );

            const empresa = empresasContratista.length > 0 ? empresasContratista[0] : empresas[0];
            this.empresaId = empresa.id;
            console.log('✅ Mi Empresa - Cargando empresa:', empresa.razonSocial);
            this.empresaForm.patchValue({
              ruc: empresa.ruc,
              razonSocial: empresa.razonSocial,
              direccion: empresa.direccion || '',
              telefono: empresa.telefono || '',
              email: empresa.email || '',
              sitioWeb: empresa.sitioWeb || '',
              rubroComercial: empresa.rubroComercial || ''
            });
          } else {
            console.warn('⚠️ Mi Empresa - No se encontraron empresas');
            this.snackBar.open('No se encontró información de la empresa', 'Cerrar', { duration: 3000 });
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Mi Empresa - Error al cargar:', err);
          this.snackBar.open('Error al cargar los datos de la empresa', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  guardarCambios(): void {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formData = this.empresaForm.getRawValue();

    const updateRequest = {
      razonSocial: formData.razonSocial,
      direccion: formData.direccion,
      telefono: formData.telefono,
      email: formData.email,
      sitioWeb: formData.sitioWeb || null,
      rubroComercial: formData.rubroComercial || null
    };

    this.empresaService.updateEmpresa(this.empresaId, updateRequest).subscribe({
      next: () => {
        this.snackBar.open('Datos de la empresa actualizados correctamente', 'Cerrar', { duration: 3000 });
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar empresa:', err);
        this.snackBar.open('Error al actualizar los datos', 'Cerrar', { duration: 3000 });
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.cargarDatosEmpresa();
  }

  getErrorMessage(field: string): string {
    const control = this.empresaForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (control?.hasError('maxlength')) {
      return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
