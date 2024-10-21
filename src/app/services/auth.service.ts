import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SignIn } from '../models/signIn.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7049/api/User'; 

  constructor(private http: HttpClient, private router: Router) {}

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');  // Retorna true se o token existir
  }

  // Realiza logout removendo o token
  logout(): void {
    localStorage.removeItem('token');  // Remove o token de login
    this.router.navigate(['/']);  // Redireciona para a página de login
  }

  // Mock de login para testes
  login(username: string, password: string): boolean {
    // Simulação de login bem-sucedido
    if (username === 'user' && password === 'password') {
      localStorage.setItem('token', 'mock-jwt-token');
      return true;
    } else {
      return false;  // Retorna false se as credenciais estiverem erradas
    }
  }

  register(signIn: SignIn): Observable<any> {
    const userRequest = signIn;
    return this.http.post(`${this.baseUrl}`, userRequest);
  }
}
