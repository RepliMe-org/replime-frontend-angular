import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatbotConfig } from '../models/chatbot-config.model';

export interface ChatbotConfigResponse {
  configInfo?: {
    configId: number;
    avatarUrl: string;
  };
}

@Injectable({ providedIn: 'root' })
export class InfluencerChatbotService {
  private baseUrl = '/api/v1/influencer/chatbot';

  constructor(private http: HttpClient) { }

  getChatbotConfig(): Observable<ChatbotConfigResponse> {
    return this.http.get<ChatbotConfigResponse>(`${this.baseUrl}`);
  }

  getStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/status`);
  }

  createConfig(data: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/config`, data, {
      responseType: 'text' as 'json',
    }) as Observable<string>;
  }

  updateConfig(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/config`, data);
  }

  addSystemClassifications(ids: number[]): Observable<string> {
    return this.http.put(`${this.baseUrl}/message-classes`, ids, {
      responseType: 'text' as 'json',
    }) as Observable<string>;
  }

  assignChatbotCategory(categoryId: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/category/${categoryId}`, data);
  }

  createCustomMessageClass(names: string[]): Observable<string> {
    return this.http.post(`${this.baseUrl}/message-classes`, names, {
      responseType: 'text' as 'json',
    }) as Observable<string>;
  }
}
