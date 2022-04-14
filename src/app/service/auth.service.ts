import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//come nel corso... da cambiare con autenticazione al server in seguito
//fake an authentication with a real server

export class AuthResponse {
  access_token: string;
  refreshToken: string;
  refreshTokenExpireIn: number;
  tokenExpireIn: number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = false;
  error = {
    message:
      'An unknown error has occured, looks like you are not on the right page.' +
      'Please consider navigate again on our website through the right routes!',
    status: 'Unknown Route',
  };

  token = null;

  constructor(private http: HttpClient, private router: Router) {}

  isAuthenticated() {
    const promise = new Promise((resolve, rejects) => {
      resolve(this.loggedIn);
    });
    return promise;
  }

  logIn(user: string, password: string) {
    this.http
      .post<AuthResponse>('http://localhost:3000/auth/login', {
        user: user,
        password: password,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.token = response.access_token;
          this.router.navigate(['/admin-search']);
          this.loggedIn = true;
        },
        error: (errorRes) => {
          this.router.navigate(['/error']);
          this.error = errorRes.error;
          console.log(errorRes.error);
        },
      });
  }

  logout() {
    this.token = null;
    this.loggedIn = false;
  }
}
