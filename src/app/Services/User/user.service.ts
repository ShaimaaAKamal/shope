import { Injectable, signal } from '@angular/core';
import { User } from '../../Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  Users=signal<User[]>([]);
  currentUser=signal<User>({} as User);

  setCurrentUser(user:User){
    this.currentUser.set(user);
  }
}
