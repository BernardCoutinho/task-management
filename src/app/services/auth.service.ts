import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SignIn } from '../models/signIn.model';
import { LogIn } from '../models/logIn.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_URL = 'https://localhost:7049/api'; 
  
  private readonly USER = this.BASE_URL + '/user'; 

  private readonly AUTH = this.BASE_URL + '/auth'; 

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');  
  }


  logout(): void {
    localStorage.removeItem('token');  
    this.router.navigate(['/']);  
  }

 
  login(username: string, password: string): Observable<any> {
    const loginRequest: LogIn = {
      username,
      password
    }

    return this.http.post(`${this.AUTH}/login`, loginRequest).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const signIn: SignIn = {
      username,
      email,
      password
    };
    return this.http.post(`${this.USER}`, signIn);
  }
}
