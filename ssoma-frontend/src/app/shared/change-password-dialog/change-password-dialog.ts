import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ChangePasswordDialogData {
  username: string;
  nombreCompleto: string;
}

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.scss'
})
export class ChangePasswordDialogComponent implements OnInit {
  passwordForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangePasswordDialogData
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatch(): boolean {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    return newPassword === confirmPassword;
  }

  getPasswordStrength(): { label: string; color: string; width: string } {
    const password = this.passwordForm.get('newPassword')?.value || '';

    if (password.length === 0) {
      return { label: '', color: '', width: '0%' };
    }

    let strength = 0;

    // Criterios de fortaleza
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      return { label: 'Débil', color: '#ef4444', width: '33%' };
    } else if (strength <= 4) {
      return { label: 'Media', color: '#f59e0b', width: '66%' };
    } else {
      return { label: 'Fuerte', color: '#10b981', width: '100%' };
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.passwordForm.valid && this.passwordsMatch()) {
      this.dialogRef.close(this.passwordForm.value.newPassword);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
    }
  }
}
