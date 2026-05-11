import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageClass } from '../models/chatbot-category.model';

@Injectable({
  providedIn: 'root',
})
export class ChatbotClassificationsService {
  private baseUrl = '/api/v1/chatbot/categories';
  constructor(private http: HttpClient) {}

  getMessageClasses(categoryId: number): Observable<MessageClass[]> {
    return this.http.get<MessageClass[]>(
      `${this.baseUrl}/${categoryId}/message-classes`,
    );
  }

  createMessageClasses( categoryId: number, names: string[] ): Observable<MessageClass[]> {
    return this.http.post<MessageClass[]>(
      `${this.baseUrl}/${categoryId}/message-classes`,
      names,
    );
  }

  deleteMessageClass(categoryId: number, classId: number): Observable<string> {
    return this.http.delete(
      `${this.baseUrl}/${categoryId}/message-classes/${classId}`,
      {
        responseType: 'text',
      },
    );
  }
}
