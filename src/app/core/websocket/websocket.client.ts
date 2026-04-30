import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class WebSocketClient implements OnDestroy {
  private client: Client | null = null;
  private subjects = new Map<string, Subject<any>>();
  private subscriptions = new Map<string, StompSubscription>();

  constructor(private authService: AuthService) {}

  connect(): void {
    if (this.client?.active) return;

    this.client = new Client({
      webSocketFactory: () => {
        return new SockJS('/api/v1/ws');
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log('[WS] Connected');
        this.subjects.forEach((subject, topic) => {
          this.doSubscribe(topic, subject);
        });
      },

      onDisconnect: () => console.log('[WS] Disconnected'),

      onStompError: (frame) => {
        console.error('[WS] Error:', frame.headers['message']);
        console.error('[WS] Details:', frame.body);
      },
    });

    this.client.activate();
  }

  on<T>(topic: string): Observable<T> {
    if (this.subjects.has(topic)) {
      return this.subjects.get(topic)!.asObservable();
    }

    const subject = new Subject<T>();
    this.subjects.set(topic, subject);

    if (this.client?.connected) {
      this.doSubscribe(topic, subject);
    }

    return subject.asObservable();
  }

  private doSubscribe<T>(topic: string, subject: Subject<T>): void {
    if (this.subscriptions.has(topic)) return;

    const sub = this.client!.subscribe(topic, (msg: IMessage) => {
      try {
        subject.next(JSON.parse(msg.body));
      } catch (e) {
        console.error(`[WS] Parse error on "${topic}"`, e);
      }
    });

    this.subscriptions.set(topic, sub);
  }

  unsubscribeTopic(topic: string): void {
    this.subscriptions.get(topic)?.unsubscribe();
    this.subscriptions.delete(topic);
    this.subjects.get(topic)?.complete();
    this.subjects.delete(topic);
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.subjects.forEach((s) => s.complete());
    this.subjects.clear();
    this.client?.deactivate();
    this.client = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}