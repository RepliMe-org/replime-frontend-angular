import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PersonaData } from '../../../../models/chatbot-config.model';

export type ReviewStepTarget =
  | 'persona'
  | 'welcome'
  | 'category'
  | 'classifications';

@Component({
  selector: 'app-chatbot-review-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chatbot-review-step.component.html',
  styleUrl: './chatbot-review-step.component.css',
})
export class ChatbotReviewStepComponent {
  @Input() personaData?: PersonaData;
  @Input() welcomeMessage!: string;
  @Input() categoryName!: string;
  @Input() systemClassNames: string[] = [];
  @Input() customClassNames: string[] = [];
  @Input() avatarUrl: string | null = null;
  @Input() isSaving = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  @Output() editStep = new EventEmitter<ReviewStepTarget>();

  totalClasses(): number {
    return this.systemClassNames.length + this.customClassNames.length;
  }


  personalityChips(): string[] {
    if (!this.personaData) return [];
    if (this.personaData.talkLikeMe) return ['Talk Like Me'];
    return [
      this.personaData.tone,
      this.personaData.verbosity,
      this.personaData.formality,
    ].filter(Boolean) as string[];
  }

  jumpTo(step: ReviewStepTarget) {
    this.editStep.emit(step);
  }
}
