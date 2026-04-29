import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketClient } from '../websocket.client';
import { WsSyncMessage } from '../websocket.model';

@Injectable({ providedIn: 'root' })
export class SyncStatusWsService {
  topic: string | null = null;

  constructor(private ws: WebSocketClient) {}

  connect(chatbotId: string): Observable<WsSyncMessage> {
    this.topic = `/topic/chatbot/${chatbotId}/sync-status`;
    this.ws.connect();
    return this.ws.on<WsSyncMessage>(this.topic);
  }

  disconnect(): void {
    if (this.topic) {
      this.ws.unsubscribeTopic(this.topic);
      this.topic = null;
    }
  }
}
