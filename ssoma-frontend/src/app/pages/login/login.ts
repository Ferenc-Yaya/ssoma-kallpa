import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth';
import { TenantService } from '../../core/services/tenant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
    private router: Router,
    private cdr: ChangeDetectorRef  // <-- AGREGAR ESTO
  ) {}

  onLogin(): void {
    // VALIDACIÓN: Verificar campos vacíos
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor ingrese usuario y contraseña';
      this.cdr.detectChanges();  // <-- FORZAR DETECCIÓN
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.tenantService.setTenant(response.tenantId);
          console.log('Login exitoso:', response);

          // Redirigir según el rol del usuario
          if (response.rol === 'SUPER_ADMIN') {
            this.router.navigate(['/dashboard-superadmin']);
          } else if (response.rol === 'ADMIN_CONTRATISTA') {
            this.router.navigate(['/dashboard-contratista']);
          } else if (response.rol === 'ADMIN_EMPRESA_PRINCIPAL') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }

          this.loading = false;
        },
        error: (error) => {
          console.error('Error de login:', error);
          
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error al conectar con el servidor';
          }
          
          this.loading = false;
          this.cdr.detectChanges();  // <-- FORZAR DETECCIÓN
        }
      });
  }
}