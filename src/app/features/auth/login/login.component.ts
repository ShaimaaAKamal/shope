import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { UserLoginData } from '../../../Interfaces/user-login-data';
import { AuthService } from '../../../Services/Auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;

  errors = {
    userEmail: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  gToRegister() {
    this.router.navigateByUrl('Auth/Register');
  }

  goToForgetPassword() {
    this.router.navigateByUrl('Auth/Forget_Password');
  }

  login() {
    const [userEmail, password] = this.inputs.map(i => i.value?.trim() ?? '');

    this.clearErrors();

    if (!userEmail) this.errors.userEmail = 'Email Address is required';
    if (!password) this.errors.password = 'Password is required';

    if (Object.values(this.errors).some(error => error)) return;

    const loginData: UserLoginData = { userEmail, password };

    this.authService.Login(loginData).subscribe({
      next: (result) => {
        if (result.token) {
          this.authService.isLogged.set(true);
          this.authService.saveToken(result.token);
        }
      }
    });
  }

  clearErrors() {
    this.errors.userEmail = '';
    this.errors.password = '';
  }
}
