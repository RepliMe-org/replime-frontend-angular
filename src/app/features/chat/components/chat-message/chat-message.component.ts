import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ChatMessage, MessageSource } from '../../../../core/models/chatbot.model';
import { Subject, from, of } from 'rxjs';
import { concatMap, delay, takeUntil } from 'rxjs/operators';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.use({
  hooks: {
    postprocess(html: string) {
      return DOMPurify.sanitize(html);
    }
  }
});

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent implements OnInit, OnDestroy {
  @Input() message: ChatMessage;
  @Input() avatarNumber: number;
  @Input() sources: MessageSource[] = [];
  @Input() isBot = false;
  @Input() isNewMessage = false;
  @Output() streamingFinished = new EventEmitter<void>();

  renderedText = '';
  isStreaming = false;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    const fullText = this.message?.message || '';
    
    if (!this.isUser && this.isNewMessage) {
      this.startFakeStreamingWithRxjs(fullText);
    } else {
      this.renderedText = fullText;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isUser(): boolean {
    return this.message?.sender === 'USER';
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  startFakeStreamingWithRxjs(fullText: string) {
    this.isStreaming = true;
    const tokens = fullText.split(/(\s+)/);

    from(tokens).pipe(
      concatMap(token => of(token).pipe(delay(30))),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (token) => {
        this.renderedText += token;
      },
      complete: () => {
        this.isStreaming = false;
        this.streamingFinished.emit();
      }
    });
  }
}

