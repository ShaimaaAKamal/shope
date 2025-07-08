import { Component, inject, ViewChild } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../../Services/Auth/auth.service';
import { User } from '../../../Interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  private __AuthService=inject(AuthService);
  private __Router=inject(Router)

  @ViewChild('mail') userEmail!:InputComponent;
  mailError:string='';
  ResetPassword(){
    this.mailError='';
    const mail=this.userEmail.value.trim()
    if(mail){
       this.__AuthService.getUserByEmail(mail).subscribe({
        next:(data)=>{
          if(data.data.length !=0){
            const user:User=data.data[0];
            if(user.id)
              this.__Router.navigateByUrl('Auth/Reset_Password');
          }else
          this.mailError='There is no user with this mail'
        }
       })
    }else
    this.mailError="Email Address is required"
  }
}
