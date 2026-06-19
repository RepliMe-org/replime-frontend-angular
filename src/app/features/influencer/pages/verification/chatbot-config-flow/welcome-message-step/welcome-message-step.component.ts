import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ChatbotConfig } from '../../../../models/chatbot-config.model';

@Component({
  selector: 'app-welcome-message-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './welcome-message-step.component.html',
  styleUrl: './welcome-message-step.component.css',
})
export class WelcomeMessageStepComponent implements OnChanges {
  
  @Input() chatbotConfig?: ChatbotConfig;

  @Output() welcomeMessageSubmit = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();

  welcomeMessage: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatbotConfig']) {
      this.welcomeMessage = this.chatbotConfig?.welcomeMessage ?? '';
    }
  }

  onContinue() {
    if (!this.welcomeMessage.trim()) return;

    this.welcomeMessageSubmit.emit(this.welcomeMessage.trim());
  }

  onBack() {
    this.back.emit();
  }
}
