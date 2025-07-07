import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../Interfaces/user';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';
import { UserLoginData } from '../../Interfaces/user-login-data';
import { CommonService } from '../CommonService/common.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
  private __CommonService=inject(CommonService);
  isLogged=signal<boolean>(false);
  token:string='';

  Register(user: User) {
    return this.__HandleActualApiInvokeService.createEntity<User>(
      'CreateUser',
      user,
      'User',
    )
  }


  Login(userData:UserLoginData) {
    return this.__HandleActualApiInvokeService.createEntity<UserLoginData>(
      'Login',
      userData,
      'User Data',
    )
  }

  resetPassword(){

  }
  changePassword(){

  }
  
  saveToken(token:string){
    this.__CommonService.saveToStorage('token',token);
    this.token=token;
  }
}
