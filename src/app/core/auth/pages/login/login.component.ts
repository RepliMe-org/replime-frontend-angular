import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { AuthFormSubmitEvent } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AuthFormComponent, CardComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onFormSubmit(event: AuthFormSubmitEvent) {
    this.isLoading = true;

    const { name, email, password, isLoginMode } = event;

    if (isLoginMode) {
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.authService.saveAuthData(response);
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          // TODO: create reusable toast for handling errors/success
          this.isLoading = false;
        },
      });
    } else {
      this.authService.signup({ name: name!, email, password }).subscribe({
        next: (response) => {
          this.authService.saveAuthData(response);
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
    }
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/api/v1/oauth2/authorization/google';
  }
}