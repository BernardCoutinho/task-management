import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'; // Importações necessárias
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LogIn } from '../../models/logIn.model';


@Component({
  standalone: true,
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.initLoginForm()
  }

  private initLoginForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]), 
      password: new FormControl('', [Validators.required]), 
    });
  }

  login(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      // Esperar pela resposta da requisição de login antes de continuar
      this.authService.login(username, password).subscribe({
        next: (response) => {
          // Se o login for bem-sucedido, armazena o token e navega
          this.router.navigate(['/todo-list']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Usuário ou senha inválidos');
        }
      });
    } else {
      alert('Por favor, preencha os campos obrigatórios.');
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
