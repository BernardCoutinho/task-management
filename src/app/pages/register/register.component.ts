import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private toastrService: ToastrService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.initRegisterForm();  
  }


  private initRegisterForm(): void {
  this.registerForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordsMatchValidator });  
}

   private passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsDoNotMatch: true };
};

register(): void {
  this.registerForm.markAllAsTouched();
  if (this.registerForm.valid) {
    
      const username = this.registerForm.get('email')?.value
      const email = this.registerForm.get('email')?.value
      const password = this.registerForm.get('password')?.value
    
    
    this.authService.register(username, email, password).subscribe({
      next: (response) => {
        this.toastrService.success('Seu registrado foi realizado com sucesso!','Registro bem-sucedido!');
        this.navigateToLogin(); 
      },
      error: (err) => {
        console.error('Erro ao registrar:', err);
        this.toastrService.error( err.message, "Erro ao registrar!")
      }
    });
  } else {
    this.toastrService.warning('Por favor, preencha todos os campos corretamente.', 'Alerta!');
  }
}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
