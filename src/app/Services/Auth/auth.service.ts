import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../Interfaces/user';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';
import { UserLoginData } from '../../Interfaces/user-login-data';
import { CommonService } from '../CommonService/common.service';
import { ChangePassword } from '../../Interfaces/change-password';
import { SetPassword } from '../../Interfaces/set-password';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
  private __CommonService=inject(CommonService);
  isLogged=signal<boolean>(true);
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
      'Login',
    )
  }

  setPassword(SetPasswordData:SetPassword){
    return this.__HandleActualApiInvokeService.createEntity<SetPassword>(
      'SetPassword',
      SetPasswordData,
      'Set Password',
    )
  }


  changePassword(ChangePasswordData:ChangePassword){
    return this.__HandleActualApiInvokeService.createEntity<ChangePassword>(
      'ChangePassword',
      ChangePasswordData,
      'Change Password Data',
    )
  }

  getUserByEmail(email:string){
   const  body: any = {
      sorts: [],
      filters: [
        {
          operation: 0,
          propertyName: "email",
          propertyValue: email
        }
      ],
      pagingModel: { index: 0, length: 0, all: false },
      properties: ''
    }
      return this.__HandleActualApiInvokeService.getEntities<User>('GetUsers', 'getUserByMail',signal<User[]>([]), body)

  }

  saveToken(token:string){
    this.__CommonService.saveToStorage('token',token);
    this.token=token;
  }
}
