import { Component, ViewChild } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  @ViewChild('mail') userEmail!:InputComponent;
  mailError:string='';
  ResetPassword(){
    if(this.userEmail.value.trim()){
      console.log('get user data by mail');

    }else
    this.mailError="Email Address is required"
  }
}
