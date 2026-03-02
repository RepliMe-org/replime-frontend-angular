import { Component } from '@angular/core';
import { LoginComponent } from '../../features/auth/pages/login/login.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
