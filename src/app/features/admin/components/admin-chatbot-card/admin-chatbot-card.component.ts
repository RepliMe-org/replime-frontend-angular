import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { AdminChatbot } from '../../models/admin-chatbot';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-admin-chatbot-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin-chatbot-card.component.html',
  styleUrl: './admin-chatbot-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminChatbotCardComponent {
  @Input() bot: AdminChatbot;

  @Output() visibilityToggle = new EventEmitter<AdminChatbot>();
  @Output() deleteChatbot = new EventEmitter<AdminChatbot>();

  onToggleVisibility() {
    this.visibilityToggle.emit(this.bot);
  }

  onDelete() {
    this.deleteChatbot.emit(this.bot);
  }
}