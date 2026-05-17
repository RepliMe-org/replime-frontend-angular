import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent {
  @Output() messageSent = new EventEmitter<string>();
  @ViewChild('textarea') textareaRef: ElementRef<HTMLTextAreaElement>;

  message = '';
  @Input() isDisabled = false;

  send(): void {
    const text = this.message.trim();
    if (!text || this.isDisabled) return;
    this.messageSent.emit(text);
    this.message = '';
    this.resetHeight();
  }

  canSend(): boolean {
    return this.message.trim().length > 0 && !this.isDisabled;
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  autoResize(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }

  resetHeight(): void {
    if (this.textareaRef?.nativeElement) {
      this.textareaRef.nativeElement.style.height = 'auto';
    }
  }
}
