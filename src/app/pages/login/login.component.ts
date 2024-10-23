import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'; // Importações necessárias
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService, IndividualConfig  } from 'ngx-toastr';
@Component({
  standalone: true,
  selector: 'app-login',
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, CommonModule, ToastrModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private toastrService: ToastrService) {}

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

    
      this.authService.login(username, password).subscribe({
        next: (response) => {
      
          this.router.navigate(['/todo-list']);
        },
        error: (err) => {
          this.toastrService.warning(err.message, "Erro no login!")
        }
      });
    } else {
      this.toastrService.warning("Por favor, preencha os campos obrigatórios.", "Alerta!")
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
