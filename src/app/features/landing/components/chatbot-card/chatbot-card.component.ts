import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

  constructor(private router: Router) {}

  avatarSrc(): string {
    return `${this.chatbot.avatarUrl}`;
  }

  navigateToChat(): void {
    this.router.navigate(['/chat', this.chatbot.id]);
  }
}