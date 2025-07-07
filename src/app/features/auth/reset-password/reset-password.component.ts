import { Component, inject, QueryList, ViewChildren } from '@angular/core';
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
  private __AuthService=inject(AuthService);
  private __Router=inject(Router);

  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  passwordError:string='';
  confirmPasswordError:string='';

  changePassword(){
    this.clearErrors();
    const password=this.inputs.get(0)?.value.trim() ?? '';
    const confirmPassword=this.inputs.get(1)?.value.trim() ?? '';
    if(!password)
      this.passwordError='Password is required';
    if(!confirmPassword)
      this.confirmPasswordError='Confirm Password is required'
    if(password != confirmPassword){
      this.passwordError='Passwords are not the same';
      this.confirmPasswordError='';
    }
    if(this.passwordError || this.confirmPasswordError) return;

    const passwords:ChangePassword={
      currentPassword: "newPassowrd",
      newPassword: password
    }

   this.__AuthService.changePassword(passwords).subscribe({
    next:()=> this.__Router.navigateByUrl('Auth/Login'),
    // error:()=> console.log('in error'),
   })

  }

  clearErrors(){
    this.confirmPasswordError='';
    this.passwordError='';

  }

}
