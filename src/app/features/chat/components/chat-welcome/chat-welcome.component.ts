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
  @Input() avatarNumber: number = 1;

  get avatarSrc(): string {
    return `assets/avatars/${this.avatarNumber}.svg`;
  }
}
