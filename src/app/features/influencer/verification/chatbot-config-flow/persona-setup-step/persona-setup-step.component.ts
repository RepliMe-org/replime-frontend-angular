import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { PersonaData } from '../../models/chatbot-config.model';


@Component({
  selector: 'app-persona-setup-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './persona-setup-step.component.html',
  styleUrl: './persona-setup-step.component.css'
})
export class PersonaSetupStepComponent {
  @Output() personaSubmit = new EventEmitter<PersonaData>();

  chatbotName = '';
  selectedPersonality = '';

  personalityOptions = [
    {
      id: 'friendly',
      label: 'Friendly & Casual',
      description: 'Warm, approachable tone like chatting with a friend',
      icon: 'fa-smile'
    },
    {
      id: 'professional',
      label: 'Professional & Informative',
      description: 'Clear, structured responses focused on knowledge sharing',
      icon: 'fa-book'
    },
    {
      id: 'energetic',
      label: 'Energetic & Enthusiastic',
      description: 'High-energy, motivating style with lots of encouragement',
      icon: 'fa-bolt'
    },
    {
      id: 'witty',
      label: 'Witty & Humorous',
      description: 'Clever, entertaining replies with a touch of humor',
      icon: 'fa-face-smile-wink'
    }
  ];

  selectPersonality(personalityId: string) {
    this.selectedPersonality = personalityId;
  }

  onContinue() {
      this.personaSubmit.emit({
        name: this.chatbotName,
        personality: this.selectedPersonality
      });
  }

  isFormValid(): boolean {
    return this.chatbotName.trim().length > 0 && this.selectedPersonality !== '';
  }
}