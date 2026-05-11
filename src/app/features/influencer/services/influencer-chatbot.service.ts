import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfluencerChatbotService {
  private baseUrl = '/api/v1/influencer/chatbot';

  constructor(private http: HttpClient) {}

  getChatbotConfig(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getStatus() {
    return this.http.get(`${this.baseUrl}/status`);
  }

  createConfig(data: any) {
    return this.http.post(`${this.baseUrl}/config`, data, {
      responseType: 'text' as 'json',
    });
  }

  updateConfig(data: any) {
    return this.http.put(`${this.baseUrl}/config`, data);
  }

  addSystemClassifications(ids: number[]) {
    return this.http.put(`${this.baseUrl}/message-classes`, ids, {
      responseType: 'text' as 'json',
    });
  }

  assignChatbotCategory(categoryId: string, data: any) {
    return this.http.patch(`${this.baseUrl}/category/${categoryId}`, data);
  }

  createCustomMessageClass(names: string[]) {
    return this.http.post(`${this.baseUrl}/message-classes`, names, {
      responseType: 'text' as 'json',
    });
  }
}
