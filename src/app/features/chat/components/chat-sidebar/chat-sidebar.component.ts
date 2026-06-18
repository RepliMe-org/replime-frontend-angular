import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChatSessionService,
} from '../../../../core/services/chat-session.service';
import { ChatSession } from '../../../../core/models/chatbot.model';
import { formatDate } from '../../../../shared/utils/date.utils';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css'],
})
export class ChatSidebarComponent implements OnChanges {
  @Input() chatbotId: string;
  @Input() chatbotName: string;
  @Input() activeSessionId: number | null = null;

  @Output() sessionSelected = new EventEmitter<number>();
  @Output() newChat = new EventEmitter<void>();
  @Output() sessionDeleted = new EventEmitter<number>();

  sessions: ChatSession[] = [];

  isLoading = false;
  isFetchingMore = false;

  nextCursor: string | null = null;
  hasMore = true;

  limit = 20;

  constructor(private chatSessionService: ChatSessionService, private toast: ToastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatbotId'] && this.chatbotId) {
      this.resetAndLoadSessions();
    }
  }

  resetAndLoadSessions(): void {
    this.sessions = [];
    this.nextCursor = null;
    this.hasMore = true;

    this.loadSessions();
  }

  loadSessions(): void {
    if (!this.hasMore || this.isFetchingMore) return;

    if (this.sessions.length === 0) {
      this.isLoading = true;
    } else {
      this.isFetchingMore = true;
    }

    this.chatSessionService
      .getSessions(
        this.chatbotId,
        this.nextCursor ?? undefined,
        this.limit,
      )
      .subscribe({
        next: (res) => {
          this.sessions = [...this.sessions, ...res.data];

          this.nextCursor = res.pagination.nextCursor;
          this.hasMore = res.pagination.hasMore;

          this.isLoading = false;
          this.isFetchingMore = false;
        },
        error: () => {
          this.isLoading = false;
          this.isFetchingMore = false;
        },
      });
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;

    const threshold = 150;

    const position = element.scrollTop + element.clientHeight;
    const height = element.scrollHeight;

    if (position >= height - threshold) {
      this.loadSessions();
    }
  }

  addOrUpdateSession(
    sessionId: number,
    title: string,
    updatedAt: string,
  ): void {
    const existingIndex = this.sessions.findIndex(
      (s) => s.id === sessionId,
    );

    if (existingIndex !== -1) {
      const existing = this.sessions[existingIndex];

      this.sessions[existingIndex] = {
        ...existing,
        sessionTopic: title,
        lastMessageAt: updatedAt,
      };

      const updatedSession = this.sessions[existingIndex];

      this.sessions.splice(existingIndex, 1);

      this.sessions.unshift(updatedSession);

      return;
    }

    this.sessions.unshift({
      id: sessionId,
      status: 'ACTIVE',
      startedAt: updatedAt,
      lastMessageAt: updatedAt,
      sessionTopic: title,
    });
  }

  selectSession(id: number): void {
    this.sessionSelected.emit(id);
  }

  deleteSession(id: number, event: Event): void {
    event.stopPropagation();

    this.chatSessionService.deleteSession(id).subscribe({
      next: () => {
        this.sessions = this.sessions.filter((s) => s.id !== id);

        this.sessionDeleted.emit(id);
      },
      error: () => {
        this.toast.error('Failed to delete session');
      },
    });
  }

  onNewChat(): void {
    this.newChat.emit();
  }

  getFormattedDate(dateStr: string): string {
    return formatDate(dateStr);
  }
}