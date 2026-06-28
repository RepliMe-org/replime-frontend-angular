import { Component, Input, OnInit, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ChatMessage, MessageSource } from '../../../../core/models/chatbot.model';
import { Subject, from, of } from 'rxjs';
import { concatMap, delay, takeUntil } from 'rxjs/operators';
import { formatTime } from '../../../../shared/utils/date.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as Prism from 'prismjs';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': "'msg-' + message?.id",
  },
})
export class ChatMessageComponent implements OnInit, AfterViewChecked {
  @Input() message: ChatMessage;
  @Input() avatarUrl: string | null;
  @Input() sources: MessageSource[] = [];
  @Input() isNewMessage = false;
  @Output() streamingFinished = new EventEmitter<void>();

  renderedText = '';
  isStreaming = false;
  needsHighlight = false;

  constructor(private cdr: ChangeDetectorRef, private destroyRef: DestroyRef) { }

  ngOnInit() {
    const fullText = this.message?.message || '';

    if (!this.isUser() && this.isNewMessage) {
      this.startFakeStreamingWithRxjs(fullText);
    } else {
      this.renderedText = fullText;
      this.needsHighlight = true;
    }
  }

  ngAfterViewChecked() {
    if (this.needsHighlight) {
      this.needsHighlight = false;
      setTimeout(() => Prism.highlightAll(), 0);
    }
  }


  isUser(): boolean {
    return this.message?.sender === 'USER';
  }

  formattedTime(): string {
    return formatTime(this.message?.sentAt);
  }

  startFakeStreamingWithRxjs(fullText: string) {
    this.isStreaming = true;
    const tokens = fullText.split(/(\s+)/);

    from(tokens).pipe(
      concatMap(token => of(token).pipe(delay(30))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (token) => {
        this.renderedText += token;
        this.needsHighlight = true;
        this.cdr.markForCheck();
      },
      complete: () => {
        this.isStreaming = false;
        this.needsHighlight = true;
        this.streamingFinished.emit();
        this.cdr.markForCheck();
      }
    });
  }
}