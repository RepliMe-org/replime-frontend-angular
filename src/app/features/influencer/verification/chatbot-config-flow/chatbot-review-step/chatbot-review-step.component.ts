import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { PersonaData } from '../../../../chatbot/models/chatbot-config.model';

@Component({
  selector: 'app-chatbot-review-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chatbot-review-step.component.html',
  styleUrl: './chatbot-review-step.component.css',
})
export class ChatbotReviewStepComponent {
  @Input() personaData!: PersonaData;
  @Input() welcomeMessage!: string;
  @Input() categoryName!: string;
  @Input() systemClassNames: string[] = [];
  @Input() customClassNames: string[] = [];
  @Input() isSaving = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  goToStep(step: number) {
    this.back.emit();
  }

  get totalClasses(): number {
    return this.systemClassNames.length + this.customClassNames.length;
  }
}