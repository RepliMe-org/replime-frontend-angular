import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let toast: jasmine.SpyObj<ToastService>;
  let router: jasmine.SpyObj<Router>;

  const authResponse = {
    accessToken: 'token',
    refreshToken: 'refresh',
    user: {
      id: '1',
      email: 'user@test.com',
    },
  } as any;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', [
      'login',
      'signup',
      'saveAuthData',
    ]);

    toast = jasmine.createSpyObj('ToastService', ['error']);

    router = jasmine.createSpyObj('Router', ['navigate']);

    authService.login.and.returnValue(of(authResponse));
    authService.signup.and.returnValue(of(authResponse));

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: ToastService,
          useValue: toast,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFormSubmit()', () => {
    it('should login successfully', () => {
      spyOn(component, 'handleOnAuthSuccess');

      component.onFormSubmit({
        email: 'user@test.com',
        password: '123456',
        isLoginMode: true,
      });

      expect(component.isLoading).toBeTrue();

      expect(authService.login).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: '123456',
      });

      expect(component.handleOnAuthSuccess).toHaveBeenCalledWith(authResponse);
    });

    it('should handle login error', () => {
      authService.login.and.returnValue(
        throwError(() => ({
          error: {
            message: 'Invalid credentials',
          },
        })),
      );

      component.onFormSubmit({
        email: 'user@test.com',
        password: '123456',
        isLoginMode: true,
      });

      expect(component.isLoading).toBeFalse();
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });

    it('should show default login error message', () => {
      authService.login.and.returnValue(throwError(() => ({})));

      component.onFormSubmit({
        email: 'user@test.com',
        password: '123456',
        isLoginMode: true,
      });

      expect(toast.error).toHaveBeenCalledWith(
        'Login failed. Please check your credentials.',
      );
    });

    it('should signup successfully', () => {
      spyOn(component, 'handleOnAuthSuccess');

      component.onFormSubmit({
        name: 'Mahmoud',
        email: 'user@test.com',
        password: '123456',
        isLoginMode: false,
      });

      expect(authService.signup).toHaveBeenCalledWith({
        name: 'Mahmoud',
        email: 'user@test.com',
        password: '123456',
      });

      expect(component.handleOnAuthSuccess).toHaveBeenCalledWith(authResponse);
    });

    it('should handle signup error', () => {
      authService.signup.and.returnValue(
        throwError(() => ({
          error: {
            message: 'Registration failed',
          },
        })),
      );

      component.onFormSubmit({
        name: 'Mahmoud',
        email: 'user@test.com',
        password: '123456',
        isLoginMode: false,
      });

      expect(component.isLoading).toBeFalse();
      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });

    it('should show default signup error message', () => {
      authService.signup.and.returnValue(throwError(() => ({})));

      component.onFormSubmit({
        name: 'Mahmoud',
        email: 'user@test.com',
        password: '123456',
        isLoginMode: false,
      });

      expect(toast.error).toHaveBeenCalledWith(
        'Registration failed. Please try again.',
      );
    });
  });

  describe('handleOnAuthSuccess()', () => {
    it('should save auth data, stop loading and navigate home', () => {
      component.isLoading = true;

      component.handleOnAuthSuccess(authResponse);

      expect(authService.saveAuthData).toHaveBeenCalledWith(authResponse);
      expect(component.isLoading).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
