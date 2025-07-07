import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../Interfaces/user';
import { PaginationContextService } from '../PaginationContext/pagination-context.service';
import { Observable, tap } from 'rxjs';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
  paginationCtx=inject(PaginationContextService);

  Users=signal<User[]>([]);
  currentUser=signal<User>({} as User);


constructor() {
  this.paginationCtx.registerEntity<User>(
    'Users',
    this.getUsers.bind(this),
    this.Users
  );
}

getUsers(body?: any): Observable<{data:User[],totalCount:number}> {
  return this.__HandleActualApiInvokeService.getEntities<User>('GetUsers', 'users',this.Users, body)
}

DeleteUser(id: number) {
  return this.__HandleActualApiInvokeService.deleteEntity<User>(
    'DeleteUser',
    id,
    'user',
    this.Users,
  ).pipe(
    tap(value => {
      this.paginationCtx.getStore('Users')?.refresh();
    })
  );
}

updateUser(user: User) {
  return this.__HandleActualApiInvokeService.updateEntity<User>(user, {
    apiMethod: 'UpdateUser',
    signal: this.Users,
    entityName: 'User',
    duplicateCheck: (cat) =>
      this.Users().some(v =>
        ( v.email === cat.email) && v.id !== cat.id
      )
  });
}

  setCurrentUser(user:User){
    this.currentUser.set(user);
  }
}
