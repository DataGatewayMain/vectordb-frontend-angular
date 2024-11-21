import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  private isAuthenticated = false;
  router: any;

  constructor() {}

  login() {
    // Logic to handle user login
    this.isAuthenticated = true;
  }

  logout() {
    // Logic to handle user logout
    this.isAuthenticated = false;
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
 
  

  isLoggedIn() {
    return this.isAuthenticated;
  }
}
