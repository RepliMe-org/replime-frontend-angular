import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ChatMessage,
  SendMessageResponse,
  SessionDetail,
  SessionsResponse,
} from '../../../core/models/chatbot.model';

@Injectable({ providedIn: 'root' })
export class ChatSessionService {
  private base = '/api/v1/sessions';

  constructor(private http: HttpClient) {}

  getSessions(
    chatbotId: string,
    cursor?: string,
    limit = 20,
  ): Observable<SessionsResponse> {
    let params: Record<string, string | number> = { chatbotId, limit };
    if (cursor) params['cursor'] = cursor;
    return this.http.get<SessionsResponse>(this.base, {
      params: params as any,
    });
  }

  createSession(chatbotId: string): Observable<SessionDetail> {
    return this.http.post<SessionDetail>(this.base, { chatbotId });
  }

  getSessionDetail(sessionId: number): Observable<SessionDetail> {
    return this.http.get<SessionDetail>(`${this.base}/${sessionId}`);
  }

  getMessages(sessionId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.base}/${sessionId}/messages`);
  }

  deleteSession(sessionId: number): Observable<any> {
    return this.http.delete(`${this.base}/${+sessionId}`);
  }

  sendMessage(
    sessionId: number,
    message: string,
  ): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(
      `${this.base}/${sessionId}/messages`,
      message,
      { headers: { 'Content-Type': 'application/json' } },
    );
  }
}
