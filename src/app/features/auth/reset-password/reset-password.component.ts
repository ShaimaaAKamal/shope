import { Component, QueryList, ViewChildren, inject } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ChangePassword } from '../../../Interfaces/change-password';
import { AuthService } from '../../../Services/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;

  errors = {
    newPassword: '',
    confirmPassword: ''
  };

  changePassword() {
    this.clearErrors();

    const [newPassword, confirmPassword] = this.inputs.map(input => input.value?.trim() ?? '');

    // Validation
    if (!newPassword) this.errors.newPassword = 'Password is required';
    if (!confirmPassword) this.errors.confirmPassword = 'Confirm Password is required';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      this.errors.newPassword = 'Passwords are not the same';
      this.errors.confirmPassword = '';
    }

    if (Object.values(this.errors).some(error => error)) return;

    const payload: ChangePassword = {
      currentPassword: 'newPassowrd', // consider updating this logic
      newPassword
    };

    this.authService.changePassword(payload).subscribe({
      next: () => this.router.navigateByUrl('Auth/Login')
    });
  }

  clearErrors() {
    this.errors.newPassword = '';
    this.errors.confirmPassword = '';
  }
}
