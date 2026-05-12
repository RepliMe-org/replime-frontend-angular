import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminChatbot } from '../../models/admin-chatbot';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-admin-chatbot-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin-chatbot-card.component.html',
  styleUrl: './admin-chatbot-card.component.css',
})
export class AdminChatbotCardComponent {
  @Input() bot: AdminChatbot;

  @Output() visibilityToggle = new EventEmitter<AdminChatbot>();

  onToggleVisibility() {
    this.visibilityToggle.emit(this.bot);
  }

  get avatarUrl(): string {
    return `assets/avatars/${this.bot.avatarNumber}.svg`;
  }
}
