import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  UserInfo,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = '/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data);
  }

  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, data);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getUserInfo(): UserInfo | null {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  getUsername(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.username : null;
  }

  getRole(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.role : null;
  }

  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }

  saveAuthData(response: AuthResponse): void {
    this.setToken(response.token);
    this.setUserInfo({
      username: response.username,
      role: response.role,
    });
  }

  updateUserRole(newRole: string): void {
    const userInfo = this.getUserInfo();
    if (userInfo) {
      userInfo.role = newRole;
      this.setUserInfo(userInfo);
    }
  }
}
