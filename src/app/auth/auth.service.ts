import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;
 
  login(value) {
    this.isLoggedIn =  value
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
