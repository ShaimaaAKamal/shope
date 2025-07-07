import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../../Services/Auth/auth.service';
import { User } from '../../../Interfaces/user';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
   userNameError:string='';
   mailError:string='';
   phoneError:string='';
   passwordError:string='';

  constructor(private __Router:Router,private __AuthService:AuthService){}

  goToLogin(){
    this.__Router.navigateByUrl('Auth/Login');
  }
  register(){
    const userName=this.inputs.get(0)?.value.trim() ?? '';
    const email=this.inputs.get(1)?.value.trim() ?? '';
    const phoneNumber=this.inputs.get(2)?.value.trim() ?? '';
    const password=this.inputs.get(3)?.value.trim() ?? '';

    this.clearErrors();
    if(!userName)
    this.userNameError='Name is required'
    if(!email)
     this.mailError='Email Address is required'
    if(!phoneNumber)
      this.phoneError='Phone is required'
      if(!password)
      this.passwordError='Password is required'

    if(this.userNameError || this.mailError || this.phoneError || this.passwordError){
        return;
    }
    else {
      const user:User={
        userName,
        email,
        phoneNumber,
        rolesId: [],
        applicationsId:[0],
        level: 0
      }

      this.__AuthService.Register(user).subscribe({
         next:()=> this.goToLogin()
      });
    }
  }

  clearErrors(){
    this.userNameError='';
    this.mailError='';
    this.phoneError='';
    this.passwordError='';
  }
}
