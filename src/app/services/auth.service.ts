import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

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

  register(username: string, password: string): void {

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = { username, password };
    users.push(newUser);

    // Atualiza os usuários no localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Após registrar o usuário, realiza o login automaticamente
    localStorage.setItem('token', 'mock-jwt-token');
    this.router.navigate(['/todo-list']);
  }
}
