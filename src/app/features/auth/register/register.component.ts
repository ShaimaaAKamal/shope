import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../../Services/Auth/auth.service';
import { User } from '../../../Interfaces/user';
import { SetPassword } from '../../../Interfaces/set-password';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;

  errors = {
    userName: '',
    email: '',
    phone: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  goToLogin() {
    this.router.navigateByUrl('Auth/Login');
  }

  register() {
    this.clearErrors();

    const [userName, email, phoneNumber, password] = this.inputs.map(i => i.value?.trim() ?? '');

    // Validation
    if (!userName) this.errors.userName = 'Name is required';
    if (!email) this.errors.email = 'Email Address is required';
    if (!phoneNumber) this.errors.phone = 'Phone is required';
    if (!password) this.errors.password = 'Password is required';

    if (Object.values(this.errors).some(err => err)) return;

    const user: User = {
      userName,
      email,
      phoneNumber,
      rolesId: [],
      applicationsId: [0],
      level: 0
    };

    this.authService.Register(user).subscribe({
      next: () => {
        const setPasswordData: SetPassword = {
          userEmail: email,
          newPassword: password
        };

        this.authService.setPassword(setPasswordData).subscribe({
          next: () => this.goToLogin()
        });
      }
    });
  }

  clearErrors() {
    Object.keys(this.errors).forEach(key => this.errors[key as keyof typeof this.errors] = '');
  }
}
