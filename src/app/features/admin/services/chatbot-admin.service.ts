import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatbotAdminService {
  private baseUrl = '/api/v1/admin/chatbots';

  constructor(private http: HttpClient) {}

  getAllChatbots() {
    return this.http.get(`${this.baseUrl}`);
  }

  updateVisibility(id: string, data: any) {
    return this.http.patch(`${this.baseUrl}/${id}/visibility`, data);
  }
}
