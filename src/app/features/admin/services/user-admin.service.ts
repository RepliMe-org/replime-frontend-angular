import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUser } from '../models/admin-chatbot';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private baseUrl = '/api/v1/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.baseUrl);
  }

  updateUserStatus(username: string, status: string): Observable<string> {
    return this.http.patch(`${this.baseUrl}/${username}/status`, null, {
      params: { status },
      responseType: 'text',
    });
  }

  updateUserRole(username: string, role: string): Observable<string> {
    return this.http.patch(`${this.baseUrl}/${username}/role`, null, {
      params: { role },
      responseType: 'text',
    });
  }

}