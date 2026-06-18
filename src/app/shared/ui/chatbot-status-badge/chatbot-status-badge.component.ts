import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot-status-badge.component.html',
  styleUrls: ['./chatbot-status-badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotStatusBadgeComponent {
  @Input() status: string;

  statusClass(): string {
    const s = this.status.toUpperCase();

    if (s === 'ACTIVE') return 'status-active';
    if (s === 'CONFIGURING' || s === 'TRAINING') return 'status-pending';
    if (s === 'FAILED') return 'status-failed';

    return 'status-default';
  }

  statusText(): string {
    const s = this.status.toUpperCase();

    if (s === 'ACTIVE') return 'Active';
    if (s === 'CONFIGURING') return 'Configuring';
    if (s === 'TRAINING') return 'Training';
    if (s === 'FAILED') return 'Failed';

    return this.status;
  }
}
