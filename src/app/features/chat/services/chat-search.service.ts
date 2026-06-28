import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageSearchResponse } from '../models/chat-search.model';

@Injectable({ providedIn: 'root' })
export class ChatSearchService {
  private base = '/api/v1/sessions/search';

  constructor(private http: HttpClient) {}

  search(chatbotId: string, query: string): Observable<MessageSearchResponse> {
    return this.http.get<MessageSearchResponse>(this.base, {
      params: { chatbotId, query },
    });
  }
}