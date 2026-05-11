import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicChatbot } from '../models/public-chatbot.model';

@Injectable({ providedIn: 'root' })
export class PublicChatbotService {
  private baseUrl = '/api/v1/chatbots';

  constructor(private http: HttpClient) {}

  getAllChatbots(): Observable<PublicChatbot[]> {
    return this.http.get<PublicChatbot[]>(this.baseUrl);
  }

  getChatbotById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
