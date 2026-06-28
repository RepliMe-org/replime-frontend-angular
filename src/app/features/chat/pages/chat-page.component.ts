import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChatMessage, DisplayMessage, SessionDetail } from '../../../core/models/chatbot.model';
import { ChatSessionService } from '../services/chat-session.service';
import { PublicChatbotService } from '../../../core/services/public-chatbot.service';
import { PublicChatbot } from '../../../core/models/public-chatbot.model';
import { MessageSearchResult } from '../models/chat-search.model';
import { ChatSidebarComponent } from '../components/chat-sidebar/chat-sidebar.component';
import { ChatMessageComponent } from '../components/chat-message/chat-message.component';
import { ChatInputComponent } from '../components/chat-input/chat-input.component';
import { ChatWelcomeComponent } from '../components/chat-welcome/chat-welcome.component';
import { ChatTypingComponent } from '../components/chat-typing/chat-typing.component';
import { ChatSearchModalComponent } from '../components/chat-search-modal/chat-search-modal.component';


@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChatSidebarComponent,
    ChatMessageComponent,
    ChatInputComponent,
    ChatWelcomeComponent,
    ChatTypingComponent,
    ChatSearchModalComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
})
export class ChatPageComponent implements OnInit, AfterViewChecked{
  @ViewChild('messageArea') messageArea: ElementRef<HTMLDivElement>;

  @ViewChild(ChatSidebarComponent) sidebar: ChatSidebarComponent;

  chatbotId: string;
  chatbot: PublicChatbot | null = null;
  sessionDetail: SessionDetail | null = null;
  activeSessionId: number | null = null;
  messages: DisplayMessage[] = [];
  
  isPageLoading = true;
  isChatLoading = false;
  isTyping = false;
  isMessageStreaming = false;
  isSidebarOpen = true;
  isSearchOpen = false;

  shouldScroll = false;

  pendingScrollMessageId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatSessionService: ChatSessionService,
    private publicChatbotService: PublicChatbotService,
  ) {}

  ngOnInit(): void {
    this.chatbotId = this.route.snapshot.paramMap.get('chatbotId') ?? '';
    this.loadInitialData();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadInitialData(): void {
    this.isPageLoading = true;

    this.publicChatbotService.getChatbotById(this.chatbotId).subscribe({
      next: (chatbot) => {
        this.chatbot = chatbot as PublicChatbot;

        this.isPageLoading = false;
      },
      error: () => {
        this.isPageLoading = false;
      },
    });
  }

  onSessionSelected(sessionId: number): void {
    if (sessionId === this.activeSessionId) return;

    this.loadSession(sessionId);
  }

  onNewChat(): void {
    this.messages = [];
    this.sessionDetail = null;
    this.activeSessionId = null;
    this.isMessageStreaming = false;
  }

  onSessionDeleted(deletedId: number): void {
    if (this.activeSessionId === deletedId) {
      this.onNewChat();
    }
  }

  onMessageSent(text: string): void {

    const userMsg: ChatMessage = {
      id: Date.now(),
      message: text,
      sender: 'USER',
      sentAt: new Date().toISOString(),
      messageStatus: 'SENT',
      messageClass: '',
    };

    this.messages.push({
      msg: userMsg,
      isNew: true,
    });

    this.isTyping = true;
    this.shouldScroll = true;

    if (!this.activeSessionId) {
      this.chatSessionService
        .createSession(this.chatbotId)
        .subscribe({
          next: (session) => {
            this.sessionDetail = session;
            this.activeSessionId = session.sessionId;

            this.sidebar?.addOrUpdateSession(
              session.sessionId,
              'New conversation',
              session.startedAt,
            );
            this.sendMessageToBackend( session.sessionId, text );
          },
          error: () => {
            this.handleMessageError();
          },
        });
      return;
    }

    this.sendMessageToBackend(
      this.activeSessionId,
      text,
    );
  }

  sendMessageToBackend( sessionId: number, text: string): void {
    this.chatSessionService
      .sendMessage(sessionId, text)
      .subscribe({
        next: (res) => {
          this.isTyping = false;
          this.isMessageStreaming = true;

          this.sidebar?.addOrUpdateSession(
            res.sessionId,
            res.sessionTitle,
            res.updatedAt,
          );

          this.messages.push({
            msg: res?.aiResponse,
            sources: res?.aiResponse?.sources,
            isNew: true,
          });

          this.shouldScroll = true;
        },
        error: () => {
          this.handleMessageError();
        },
      });
  }

  handleMessageError(): void {
    this.isTyping = false;

    this.isMessageStreaming = false;

    const errMsg: ChatMessage = {
      id: Date.now(),
      message: 'Sorry, something went wrong. Please try again.',
      sender: 'BOT' ,
      sentAt: new Date().toISOString(),
      messageStatus: 'SENT',
      messageClass: 'error',
    };

    this.messages.push({
      msg: errMsg,
      isNew: true,
    });
    this.shouldScroll = true;
  }

  onStreamingFinished(): void {
    this.isMessageStreaming = false;
  }

  onSearchResultSelected(result: MessageSearchResult): void {
    this.isSearchOpen = false;

    if (result.sessionId === this.activeSessionId) {
      this.scrollToMessage(result.messageId);
      return;
    }

    this.pendingScrollMessageId = result.messageId;
    this.loadSession(result.sessionId);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goBack(): void {
    this.router.navigate(['/explore']);
  }

  scrollToBottom(): void {
    requestAnimationFrame(() => {
      const el = this.messageArea?.nativeElement;

      if (!el) return;

      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'auto',
      });
    });
  }

  loadSession(sessionId: number): void {
    this.activeSessionId = sessionId;
    this.messages = [];
    this.isChatLoading = true;
    this.isMessageStreaming = false;

    forkJoin({
      detail: this.chatSessionService.getSessionDetail(sessionId),
      msgs: this.chatSessionService.getMessages(sessionId),
    }).subscribe({
      next: ({ detail, msgs }) => {
        this.sessionDetail = detail;
        this.messages = msgs.map((m) => ({
          msg: m,
          sources: m?.sources,
          isNew: false,
        }));
        this.isChatLoading = false;

        if (this.pendingScrollMessageId != null) {
          const targetId = this.pendingScrollMessageId;
          this.pendingScrollMessageId = null;
          this.scrollToMessage(targetId);
        } else {
          this.shouldScroll = true;
        }
      },
      error: () => {
        this.isChatLoading = false;
        this.pendingScrollMessageId = null;
      },
    });
  }

  scrollToMessage(messageId: number): void {
    requestAnimationFrame(() => {
      const el = document.getElementById('msg-' + messageId);
      if (!el) {
        this.shouldScroll = true;
        return;
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('chat-msg-highlight');
      setTimeout(() => el.classList.remove('chat-msg-highlight'), 1800);
    });
  }
}