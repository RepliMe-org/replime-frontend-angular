import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatbotPublicService {
  private base = '/api/v1/chatbots';

  constructor(private http: HttpClient) {}

  getAllChatbots() {
    return this.http.get(`${this.base}`);
  }

  getChatbotById(id: string) {
    return this.http.get(`${this.base}/${id}`);
  }
}
