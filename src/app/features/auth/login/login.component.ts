import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private __Router:Router){}

  gToRegister(){
    this.__Router.navigateByUrl('Auth/Register');
  }
  goToForgetPassword(){
    this.__Router.navigateByUrl('Auth/Forget_Password');
  }
  login(){}
}
