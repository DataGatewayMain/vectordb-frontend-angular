// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationServiceService } from './authentication-service.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationServiceService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('AuthGuard: canActivate');
  
    if (localStorage.getItem('email')) {
      // User is logged in
      return true;
    } else {
      // User is not logged in, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
