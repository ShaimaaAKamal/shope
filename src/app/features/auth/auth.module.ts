import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SendEmailComponent } from './send-email/send-email.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    SendEmailComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
