import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth';
import { TenantService } from '../../core/services/tenant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatButtonModule
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
    private router: Router
  ) {}

  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.tenantService.setTenant(response.user.tenant);
          this.router.navigate(['/dashboard']);
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          this.loading = false;
        }
      });
  }
}