import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { SharedModule } from '../../../../../shared/shared.module';
import { ToastService } from '../../../../../core/services/toast.service';
import { InfluencerChatbotService } from '../../../services/influencer-chatbot.service';

@Component({
  selector: 'app-bot-settings',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './bot-settings.component.html',
  styleUrl: './bot-settings.component.css',
})
export class BotSettingsComponent implements OnInit {
  settingsForm: FormGroup;

  isLoading = true;
  isSaving = false;
  loadError = false;

  fetchChannel = false;
  avatarUrl: string | null = null;
  initialFormValue: any = null;

  constructor(
    private fb: FormBuilder,
    private chatbotService: InfluencerChatbotService,
    private toast: ToastService,
  ) {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      greetingMessage: ['', Validators.required],
      talkLikeMe: [false],
      tone: ['friendly'],
      verbosity: ['balanced'],
      formality: ['neutral'],
    });
  }

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig() {
    this.isLoading = true;
    this.loadError = false;

    this.chatbotService
      .getChatbotConfig()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => this.applyConfig(res),
        error: () => {
          this.loadError = true;
          this.toast.error(
            'Failed to load your chatbot settings. Please refresh.',
          );
        },
      });
  }

  applyConfig(res) {
    const source = res?.configInfo ?? res ?? {};

    const talkLikeMe = !!source.talkLikeMe;

    this.settingsForm.patchValue({
      name: source.chatbotName ?? source.name ?? '',
      description: source.chatbotDescription ?? source.description ?? '',
      greetingMessage: source.greetingMessage ?? source.welcomeMessage ?? '',
      talkLikeMe,
      tone: this.toLower(source.tone, 'friendly'),
      verbosity: this.toLower(source.verbosity, 'balanced'),
      formality: this.toLower(source.formality, 'neutral'),
    });

    this.fetchChannel = source.fetchChannel;
    this.avatarUrl = source.avatarUrl ?? null;

    this.syncToneFieldsDisabled(talkLikeMe);

    this.initialFormValue = this.settingsForm.getRawValue();

    this.settingsForm.markAsPristine();
  }

  toLower(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.length > 0
      ? value.toLowerCase()
      : fallback;
  }
  talkLikeMe(): boolean {
    return this.settingsForm.get('talkLikeMe')?.value;
  }

  toggleTalkLikeMe() {
    const next = !this.talkLikeMe();
    this.settingsForm.patchValue({ talkLikeMe: next });
    this.syncToneFieldsDisabled(next);
  }

  syncToneFieldsDisabled(talkLikeMe: boolean) {
    const tone = this.settingsForm.get('tone');
    const formality = this.settingsForm.get('formality');

    if (talkLikeMe) {
      tone?.disable();
      formality?.disable();
    } else {
      tone?.enable();
      formality?.enable();
    }
  }

  isFormValid(): boolean {
    return this.settingsForm.valid;
  }

  onSave() {
    if (!this.settingsForm.valid || this.isSaving) return;

    const raw = this.settingsForm.getRawValue();

    const payload = {
      name: raw.name,
      description: raw.description,
      greetingMessage: raw.greetingMessage,
      talkLikeMe: raw.talkLikeMe,
      tone: raw.tone.toUpperCase(),
      verbosity: raw.verbosity.toUpperCase(),
      formality: raw.formality.toUpperCase(),
    };

    this.isSaving = true;

    this.chatbotService
      .updateConfig(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (res: any) => {
          this.toast.success('Chatbot settings updated successfully.');
          this.applyConfig(res);
          this.initialFormValue = this.settingsForm.getRawValue();
        },
        error: (err) => {
          this.toast.error(
            err?.error?.message ||
              'Failed to update settings. Please try again.',
          );
        },
      });
  }

  hasChanges(): boolean {
    return (
      JSON.stringify(this.initialFormValue) !==
      JSON.stringify(this.settingsForm.getRawValue())
    );
  }
}
