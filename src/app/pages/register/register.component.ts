import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  
import { Router } from '@angular/router';
import { SignIn } from '../../models/signIn.model';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.initRegisterForm();  // Inicializar o formulário
  }

  // Função para criar o FormGroup
  private initRegisterForm(): void {
  this.registerForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordsMatchValidator });  
}

  // Validador customizado para garantir que os campos de senha e confirmação sejam iguais
  private passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsDoNotMatch: true };
};

register(): void {
  this.registerForm.markAllAsTouched();
  if (this.registerForm.valid) {
    const signIn: SignIn = {
      username: this.registerForm.get('email')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    };
    
    this.authService.register(signIn).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.router.navigate(['/todo-list']); 
      },
      error: (err) => {
        console.error('Erro ao registrar:', err);
        alert('Ocorreu um erro ao registrar o usuário. Tente novamente.');
      }
    });
  } else {
    alert('Por favor, preencha todos os campos corretamente.');
  }
}

  // Navega de volta para a página de login
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
