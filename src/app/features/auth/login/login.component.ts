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

   userEmailError:string='';
   passwordError:string='';
  //  failedLogin:boolean=false;
   constructor(private __Router:Router,private __AuthService:AuthService){}
  gToRegister(){
    this.__Router.navigateByUrl('Auth/Register');
  }
  goToForgetPassword(){
    this.__Router.navigateByUrl('Auth/Forget_Password');
  }
  login(){
     const userEmail=this.inputs.get(0)?.value.trim() ?? '';
    const password=this.inputs.get(1)?.value.trim() ?? '';

        this.clearErrors();
        if(!userEmail)
        this.userEmailError='Email Address is required'

        if(!password)
          this.passwordError='Password is required'

        if(this.userEmailError || this.passwordError){
            return;
        }
        else {
          const UserLoginData:UserLoginData={
            userEmail,
            password
          }
          this.__AuthService.Login(UserLoginData).subscribe({
             next:(result)=> {
              if(result.token) {
                 this.__AuthService.isLogged.set(true);
                 this.__AuthService.saveToken(result.token);
              }
             }
            //  ,error: (err) => {
            //    this.failedLogin=true;
            //  }
          });
        }
  }

  clearErrors(){
    this.userEmailError='';
    this.passwordError='';
    // this.failedLogin=false
  }
}
