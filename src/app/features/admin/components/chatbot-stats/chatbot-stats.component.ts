import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../../../shared/ui/stat-card/stat-card.component';

@Component({
  selector: 'app-chatbot-stats',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './chatbot-stats.component.html',
  styleUrls: ['./chatbot-stats.component.css'],
})
export class ChatbotStatsComponent {
  @Input() total = 0;
  @Input() active = 0;
  @Input() training = 0;
  @Input() failed = 0;
}
