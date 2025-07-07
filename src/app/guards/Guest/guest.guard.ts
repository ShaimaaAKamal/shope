// guest.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLogged = this.authService.isLogged()

    if (isLogged) {
      this.router.navigateByUrl('Orders/create');
      return false;
    }

    return true;
  }
}
