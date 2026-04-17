import { Component, EventEmitter, Input, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SharedModule } from '../../../../shared/shared.module';
import { VerifyChannelStepComponent } from '../channel-verification-flow/verify-channel-step/verify-channel-step.component';
import { AddTokenStepComponent } from '../channel-verification-flow/add-token-step/add-token-step.component';
import { ReadyVerifyStepComponent } from '../channel-verification-flow/ready-verify-step/ready-verify-step.component';
import { VerificationCompleteStepComponent } from '../channel-verification-flow/verification-complete-step/verification-complete-step.component';
import { VerificationService } from '../../services/verification.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { VerificationResponse } from '../models/verification.model';
import { PersonaSetupStepComponent } from '../chatbot-config-flow/persona-setup-step/persona-setup-step.component';
import {PersonaData, ChatbotConfig} from '../../../chatbot/models/chatbot-config.model';
import { WelcomeMessageStepComponent } from '../chatbot-config-flow/welcome-message-step/welcome-message-step.component';
import { CategorySelectionStepComponent } from '../chatbot-config-flow/category-selection-step/category-selection-step.component';
import { ChatbotReviewStepComponent } from '../chatbot-config-flow/chatbot-review-step/chatbot-review-step.component';
import { ChatbotCategory } from '../../../chatbot/models/chatbot-category.model';
import { ChatbotService } from '../../../chatbot/services/chatbot.service';
import { MessageClassificationStepComponent } from '../chatbot-config-flow/message-classification-step/message-classification-step.component';
import { ClassificationsOutput } from '../models/classification.model';

@Component({
  selector: 'app-verification-container',
  standalone: true,
  imports: [
    SharedModule,
    VerifyChannelStepComponent,
    AddTokenStepComponent,
    ReadyVerifyStepComponent,
    VerificationCompleteStepComponent,
    PersonaSetupStepComponent,
    WelcomeMessageStepComponent,
    CategorySelectionStepComponent,
    MessageClassificationStepComponent,
    ChatbotReviewStepComponent,
  ],
  templateUrl: './verification-container.component.html',
  styleUrl: './verification-container.component.css',
})
export class VerificationContainerComponent {
  @Input() state!: 'CHANNEL_VERIFICATION' | 'CHATBOT_SETUP';
  @Output() stateChange = new EventEmitter<'CHANNEL_VERIFICATION' | 'CHATBOT_SETUP' | 'DASHBOARD'>();
  currentStep: number = 0;

  channelUrl: string = '';
  verificationToken: string = '';
  expirationDate: string = '';
  isVerifying: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  chatbotConfig: ChatbotConfig = {
    personaData: {
    name: '',
    description: '',
    talkLikeMe: false,
    tone: 'friendly',
    verbosity: 'balanced',
    formality: 'neutral',
  },
    welcomeMessage: '',
    category: '',
    systemClassIds: [],
    customClassNames: [],
  };

  selectedCategoryName: string = '';
  selectedSystemClassNames: string[] = [];

  isSavingConfig: boolean = false;

  verificationSteps = ['Verify Channel', 'Add Token', 'Confirm', 'Complete'];
  chatbotSteps = [ 'AI Persona', 'Welcome Message', 'Category', 'Classifications', 'Review'];

  constructor(
    private verificationService: VerificationService,
    private authService: AuthService,
    private chatbotService: ChatbotService,
    private router: Router,
  ) {}

  onChannelSubmit(url: string) {
    this.channelUrl = url;
    this.isLoading = true;
    this.errorMessage = '';

    this.verificationService.requestVerification(url).subscribe({
      next: (res) => this.handleOnChannelSubmitSuccess(res),
      error: (err) => this.handleError(err, 'Failed to request verification.'),
    });
  }

  handleOnChannelSubmitSuccess(response: VerificationResponse) {
    this.isLoading = false;
    this.verificationToken = response?.verificationToken;
    this.expirationDate = response?.expirationDateAt;
    this.stepForward();
  }

  onTokenAdded() {
    this.stepForward();
  }

  onVerificationStart() {
    this.isVerifying = true;
    this.errorMessage = '';

    this.verificationService.confirmVerification().subscribe({
      next: () => {
        this.isVerifying = false;
        this.authService.updateUserRole('INFLUENCER');
        this.stepForward();
      },
      error: (err) =>
        this.handleError(err,'Verification failed. Ensure token is correct.'),
    });
  }

  onCompleteChannelVerification() {
    this.stateChange.emit('CHATBOT_SETUP');
    this.currentStep = 0;
  }

  onPersonaSubmit(data: PersonaData) {
    this.chatbotConfig.personaData = data;
    this.stepForward();
  }

  onWelcomeMessageSubmit(message: string) {
    this.chatbotConfig.welcomeMessage = message;
    this.stepForward();
  }

  onCategorySubmit(category: ChatbotCategory) {
    this.chatbotConfig.category = category.id.toString();
    this.selectedCategoryName = category.name;
    this.stepForward();
  }

  onClassificationsSubmit(data: ClassificationsOutput) {
    this.chatbotConfig.systemClassIds = data.systemClassIds;
    this.chatbotConfig.customClassNames = data.customClassNames;
    this.selectedSystemClassNames = data.systemClassNames ?? [];
    this.stepForward();
  }

  onConfirmSetup() {
    this.isSavingConfig = true;
    this.errorMessage = '';
    this.createConfig();
  }

  createConfig() {
    const { personaData, welcomeMessage } = this.chatbotConfig;

    const payload = {
      name: personaData.name,
      description: personaData.description,
      greetingMessage: welcomeMessage,
      talkLikeMe: personaData.talkLikeMe,
      tone: personaData.tone.toUpperCase(),
      verbosity: personaData.verbosity.toUpperCase(),
      formality: personaData.formality.toUpperCase(),
    };

    this.chatbotService.createConfig(payload).subscribe({
      next: () => this.assignCategory(),
      error: (err) =>
        this.handleError(err, 'Failed to create chatbot config.'),
    });
  }

  assignCategory() {
    this.chatbotService
      .updateCategory(this.chatbotConfig.category, {})
      .subscribe({
        next: () => this.handleClassifications(),
        error: (err) =>
          this.handleError(err, 'Failed to assign category.'),
      });
  }

  handleClassifications() {
    const systemCall = this.chatbotService.updateMessageClass(this.chatbotConfig.systemClassIds);

    const customCall = this.chatbotService.createMessageClass(this.chatbotConfig.customClassNames);

    forkJoin([systemCall, customCall]).subscribe({
      next: () => this.handleSuccess(),
      error: (err) =>
        this.handleError(err, 'Failed to save classifications.'),
    });
  }

  handleSuccess() {
    this.isSavingConfig = false;
    this.stateChange.emit('DASHBOARD');
    this.router.navigate(['/dashboard']);
  }

  handleError(err: any, fallback: string) {
    this.isSavingConfig = false;
    this.isLoading = false;
    this.isVerifying = false;
    this.errorMessage = err?.error?.error || fallback;
  }

  onBack() {
    this.stepBack();
    this.errorMessage = '';
  }

  stepForward() {
    this.currentStep++;
  }

  stepBack() {
    this.currentStep--;
  }

  onStartOver() {
    this.currentStep = 0;
    this.channelUrl = '';
    this.verificationToken = '';
    this.expirationDate = '';
    this.isVerifying = false;
    this.isLoading = false;
    this.errorMessage = '';
  }
}
