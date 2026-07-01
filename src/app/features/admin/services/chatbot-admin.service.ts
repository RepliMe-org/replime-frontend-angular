import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatbotAdminService {
  private baseUrl = '/api/v1/admin/chatbots';

  constructor(private http: HttpClient) {}

  getAllChatbots() {
    return this.http.get(`${this.baseUrl}`);
  }

  updateVisibility(id: string, isPublic: boolean) {
    const params = new HttpParams().set('isPublic', isPublic.toString());

    return this.http.patch(`${this.baseUrl}/${id}/visibility`, null, {
      params: params,
      responseType: 'text',
    });
  }

  deleteChatbot(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      responseType: 'text',
    });
  }
}