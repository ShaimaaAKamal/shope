import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private __Router:Router){}

  goToLogin(){
    console.log('in');
    this.__Router.navigateByUrl('Auth/Login');
  }
  register(){}
}
