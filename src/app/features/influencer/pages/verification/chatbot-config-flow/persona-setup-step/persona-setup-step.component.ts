import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PersonaData } from '../../../../../chatbot/models/chatbot-config.model';


@Component({
  selector: 'app-persona-setup-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './persona-setup-step.component.html',
  styleUrl: './persona-setup-step.component.css'
})
export class PersonaSetupStepComponent implements OnInit {
  @Input() personaData?: PersonaData;
  @Output() personaSubmit = new EventEmitter<PersonaData>();

  chatbotName: string = '';
  chatbotDescription: string = '';
  selectedPersonality: string = '';
  talkLikeMe: boolean = false;
  fetchChannel: boolean = false;

  verbosity: string = 'balanced';
  formality: string = 'neutral';
  tone: string = 'friendly';

  ngOnInit() {
  if (this.personaData) {
    this.chatbotName = this.personaData.name ?? '';
    this.chatbotDescription = this.personaData.description ?? '';
    this.talkLikeMe = this.personaData.talkLikeMe ?? false;
    this.fetchChannel = this.personaData.fetchChannel ?? false;

    this.tone = this.personaData.tone ?? 'friendly';
    this.verbosity = this.personaData.verbosity ?? 'balanced';
    this.formality = this.personaData.formality ?? 'neutral';
  }
}

  toggleTalkLikeMe() {
    this.talkLikeMe = !this.talkLikeMe;
  }

  toggleFetchChannel() {
    this.fetchChannel = !this.fetchChannel;
  }

  isDisabled() {
    return this.talkLikeMe;
  }

  onContinue() {
    const payload: PersonaData = {
      name: this.chatbotName,
      description: this.chatbotDescription,
      talkLikeMe: this.talkLikeMe,
      fetchChannel: this.fetchChannel,
      tone: this.tone,
      verbosity: this.verbosity,
      formality: this.formality,
    };

    this.personaSubmit.emit(payload);
  }

  isFormValid(): boolean {
    return (
      this.chatbotName.trim().length > 0 &&
      this.chatbotDescription.trim().length > 0
    );
  }
}
