import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatbotCategory } from '../models/chatbot-category.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotCategoryService {
  private baseUrl = '/api/v1/chatbot/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ChatbotCategory[]> {
    return this.http.get<ChatbotCategory[]>(this.baseUrl);
  }

  createCategories(names: string[]): Observable<string> {
    return this.http.post(this.baseUrl, names, {
      responseType: 'text',
    });
  }

  deleteCategory(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      responseType: 'text',
    });
  }
}
