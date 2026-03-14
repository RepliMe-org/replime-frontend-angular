import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-welcome-message-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './welcome-message-step.component.html',
  styleUrl: './welcome-message-step.component.css'
})
export class WelcomeMessageStepComponent {

  @Input() chatbotName: string = '';

  @Output() welcomeMessageSubmit = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();

  welcomeMessage: string = '';

  onContinue() {
    if (!this.welcomeMessage.trim()) return;

    this.welcomeMessageSubmit.emit(this.welcomeMessage.trim());
  }

  onBack() {
    this.back.emit();
  }
}