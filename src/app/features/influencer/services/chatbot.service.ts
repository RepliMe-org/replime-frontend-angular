import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly baseUrl = '/api/v1/influencer/chatbot'

  constructor(private http: HttpClient) { }

  getChatbotConfig(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
