import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatbotCategory } from '../models/chatbot-category.model';

@Injectable({ providedIn: 'root' })
export class ChatbotCategoryService {
  private base = '/api/v1/chatbot/categories';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<ChatbotCategory[]>(this.base);
  }

  createCategory(data: string) {
    return this.http.post(`${this.base}`, data);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getMessageClasses(categoryId: string) {
    return this.http.get(`${this.base}/${categoryId}/message-classes`);
  }

  createMessageClass(categoryId: string, data: any) {
    return this.http.post(`${this.base}/${categoryId}/message-classes`, data);
  }
}
