import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SendEmailComponent } from './send-email/send-email.component';

const routes: Routes = [{ path: '', component: AuthComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Forget_Password', component: ForgetPasswordComponent },
  { path: 'Reset_Password', component: ResetPasswordComponent },
  { path: 'sendMail', component: SendEmailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
