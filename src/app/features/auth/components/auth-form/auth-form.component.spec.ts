import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthFormComponent } from './auth-form.component';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthFormComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize the form', () => {
      expect(component.form).toBeTruthy();

      expect(component.form.contains('name')).toBeTrue();
      expect(component.form.contains('email')).toBeTrue();
      expect(component.form.contains('password')).toBeTrue();
    });

    it('should start in login mode', () => {
      expect(component.isLoginMode).toBeTrue();
    });
  });

  describe('toggleMode()', () => {
    it('should switch to signup mode', () => {
      component.form.patchValue({
        name: 'Mahmoud',
        email: 'test@test.com',
        password: '123456',
      });

      component.toggleMode();

      expect(component.isLoginMode).toBeFalse();
      expect(component.form.pristine).toBeTrue();

      const nameControl = component.form.get('name');

      nameControl?.setValue('');

      expect(nameControl?.hasError('required')).toBeTrue();
    });

    it('should switch back to login mode', () => {
      component.toggleMode();
      component.toggleMode();

      expect(component.isLoginMode).toBeTrue();

      const nameControl = component.form.get('name');

      nameControl?.setValue('');
      nameControl?.updateValueAndValidity();

      expect(nameControl?.hasError('required')).toBeFalse();
    });
  });

  describe('submit()', () => {
    it('should mark all controls as touched when form is invalid', () => {
      spyOn(component.form, 'markAllAsTouched');

      component.submit();

      expect(component.form.markAllAsTouched).toHaveBeenCalled();
    });

    it('should emit login form values', () => {
      spyOn(component.formSubmit, 'emit');

      component.form.patchValue({
        email: 'user@test.com',
        password: '123456',
      });

      component.submit();

      expect(component.formSubmit.emit).toHaveBeenCalledWith({
        name: '',
        email: 'user@test.com',
        password: '123456',
        isLoginMode: true,
      });
    });

    it('should emit signup form values', () => {
      spyOn(component.formSubmit, 'emit');

      component.toggleMode();

      component.form.patchValue({
        name: 'Mahmoud',
        email: 'user@test.com',
        password: '123456',
      });

      component.submit();

      expect(component.formSubmit.emit).toHaveBeenCalledWith({
        name: 'Mahmoud',
        email: 'user@test.com',
        password: '123456',
        isLoginMode: false,
      });
    });

    it('should not emit when signup name is missing', () => {
      spyOn(component.formSubmit, 'emit');

      component.toggleMode();

      component.form.patchValue({
        name: '',
        email: 'user@test.com',
        password: '123456',
      });

      component.submit();

      expect(component.formSubmit.emit).not.toHaveBeenCalled();
    });

    it('should not emit when email is invalid', () => {
      spyOn(component.formSubmit, 'emit');

      component.form.patchValue({
        email: 'invalid-email',
        password: '123456',
      });

      component.submit();

      expect(component.formSubmit.emit).not.toHaveBeenCalled();
    });

    it('should not emit when password is shorter than 6 characters', () => {
      spyOn(component.formSubmit, 'emit');

      component.form.patchValue({
        email: 'user@test.com',
        password: '123',
      });

      component.submit();

      expect(component.formSubmit.emit).not.toHaveBeenCalled();
    });
  });
});
