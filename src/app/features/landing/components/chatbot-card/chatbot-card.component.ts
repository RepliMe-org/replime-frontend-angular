import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicChatbot } from '../../../../core/models/public-chatbot.model';

@Component({
  selector: 'app-chatbot-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chatbot-card.component.html',
  styleUrl: './chatbot-card.component.css',
})
export class ChatbotCardComponent {
  @Input() chatbot: PublicChatbot;

  get avatarSrc(): string {
    return `assets/avatars/${this.chatbot.avatarNumber}.svg`;
  }

}