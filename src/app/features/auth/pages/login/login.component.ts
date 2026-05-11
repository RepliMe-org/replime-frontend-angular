import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { AuthFormSubmitEvent } from '../../../../core/models/auth.model';
import { SharedModule } from '../../../../shared/shared.module';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, AuthFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

  onFormSubmit(event: AuthFormSubmitEvent) {
    this.isLoading = true;

    const { name, email, password, isLoginMode } = event;

    if (isLoginMode) {
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.handleOnAuthSuccess(response);
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Login failed. Please check your credentials.');
          this.isLoading = false;
        },
      });
    } else {
      this.authService.signup({ name: name!, email, password }).subscribe({
        next: (response) => {
          this.handleOnAuthSuccess(response);
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Registration failed. Please try again.');
          this.isLoading = false;
        },
      });
    }
  }

  handleOnAuthSuccess(response : any) {
    this.authService.saveAuthData(response);
    this.isLoading = false;
    this.router.navigate(['/']);
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/api/v1/oauth2/authorization/google';
  }
}
