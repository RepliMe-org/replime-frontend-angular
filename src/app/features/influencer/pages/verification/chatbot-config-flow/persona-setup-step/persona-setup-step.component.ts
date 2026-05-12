import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PersonaData } from '../../../../models/chatbot-config.model'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-persona-setup-step',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './persona-setup-step.component.html',
  styleUrl: './persona-setup-step.component.css'
})
export class PersonaSetupStepComponent implements OnInit {
  @Input() personaData?: PersonaData;
  @Output() personaSubmit = new EventEmitter<PersonaData>();

  personaForm: FormGroup;
  avatarList: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(private fb: FormBuilder) {
    this.personaForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      talkLikeMe: [false],
      fetchChannel: [false],
      tone: ['friendly'],
      verbosity: ['balanced'],
      formality: ['neutral'],
      avatarNumber: [1]
    });
  }

  ngOnInit() {
    if (this.personaData) {
      this.personaForm.patchValue({
        name: this.personaData.name ?? '',
        description: this.personaData.description ?? '',
        talkLikeMe: this.personaData.talkLikeMe ?? false,
        fetchChannel: this.personaData.fetchChannel ?? false,
        tone: this.personaData.tone ?? 'friendly',
        verbosity: this.personaData.verbosity ?? 'balanced',
        formality: this.personaData.formality ?? 'neutral',
        avatarNumber: this.personaData.avatarNumber ?? 1
      });
    }
  }

  selectedAvatar() { return this.personaForm.get('avatarNumber')?.value; }
  talkLikeMe() { return this.personaForm.get('talkLikeMe')?.value; }
  fetchChannel() { return this.personaForm.get('fetchChannel')?.value; }

  toggleTalkLikeMe() {
    const talkLikeMe = !this.talkLikeMe();

    this.personaForm.patchValue({ talkLikeMe });

    if (talkLikeMe) {
      this.personaForm.get('tone')?.disable();
      this.personaForm.get('formality')?.disable();
    } else {
      this.personaForm.get('tone')?.enable();
      this.personaForm.get('formality')?.enable();
    }
  }

  toggleFetchChannel() {
    this.personaForm.patchValue({ fetchChannel: !this.fetchChannel() });
  }

  selectAvatar(n: number) { 
    this.personaForm.patchValue({ avatarNumber: n });
  }

  onContinue() {
    if (this.personaForm.valid) {
      this.personaSubmit.emit(this.personaForm.getRawValue());
    }
  }

  isFormValid(): boolean {
    return this.personaForm.valid;
  }
}
