import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-welcome.component.html',
  styleUrls: ['./chat-welcome.component.css'],
})
export class ChatWelcomeComponent {
  @Input() chatbotName:string;
  @Input() greetingMessage:string;
  @Input() avatarUrl: string | null;

  get avatarSrc(): string {
    return `${this.avatarUrl}`;
  }
}
