import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFormSubmitEvent } from '../../../../core/models/auth.model';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports';


@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
})
export class AuthFormComponent implements OnInit {
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<AuthFormSubmitEvent>();

  form!: FormGroup;
  isLoginMode = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.form.reset();

    const nameControl = this.form.get('name');
    if (!this.isLoginMode) {
      nameControl?.setValidators([Validators.required]);
    } else {
      nameControl?.clearValidators();
    }
    nameControl?.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.value;
    this.formSubmit.emit({ name, email, password, isLoginMode: this.isLoginMode });
  }
}