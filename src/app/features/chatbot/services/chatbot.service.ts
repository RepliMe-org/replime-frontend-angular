import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private base = '/api/v1/influencer/chatbot';

  constructor(private http: HttpClient) {}

  getChatbot() {
    return this.http.get(`${this.base}`);
  }

  getStatus() {
    return this.http.get(`${this.base}/status`);
  }

  createConfig(data: any) {
    return this.http.post(`${this.base}/config`, data, {
      responseType: 'text' as 'json',
    });
  }

  updateConfig(data: any) {
    return this.http.put(`${this.base}/config`, data);
  }

  getMessageClasses() {
    return this.http.get(`${this.base}/message-classes`);
  }

  createMessageClass(names: string[]) {
    return this.http.post(`${this.base}/message-classes`, names, {
      responseType: 'text' as 'json',
    });
  }

  updateMessageClass(ids: number[]) {
    return this.http.put(`${this.base}/message-classes`, ids, {
      responseType: 'text' as 'json',
    });
  }

  deleteMessageClass(id: string) {
    return this.http.delete(`${this.base}/message-classes/${id}`);
  }

  updateCategory(categoryId: string, data: any) {
    return this.http.patch(`${this.base}/category/${categoryId}`, data);
  }
}
