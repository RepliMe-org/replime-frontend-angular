import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { VerifyChannelStepComponent } from '../channel-verification-flow/verify-channel-step/verify-channel-step.component';
import { AddTokenStepComponent } from '../channel-verification-flow/add-token-step/add-token-step.component';
import { ReadyVerifyStepComponent } from '../channel-verification-flow/ready-verify-step/ready-verify-step.component';
import { VerificationCompleteStepComponent } from '../channel-verification-flow/verification-complete-step/verification-complete-step.component';
import { VerificationService } from '../verification.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { VerificationResponse} from '../models/verification.model';
import { PersonaSetupStepComponent } from '../chatbot-config-flow/persona-setup-step/persona-setup-step.component';
import { PersonaData } from '../models/chatbot-config.model';

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
  ],
  templateUrl: './verification-container.component.html',
  styleUrl: './verification-container.component.css',
})
export class VerificationContainerComponent {
  currentStep: number = 0;
  channelUrl: string = '';
  verificationToken: string = '';
  expirationDate: string = '';
  isVerifying: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  isChannelVerificationComplete: boolean = false;

  verificationSteps = ['Verify Channel', 'Add Token', 'Confirm', 'Complete'];
  chatbotSteps = ['AI Persona', 'Welcome Message', 'Confirm', 'Complete'];

  constructor(
    private verificationService: VerificationService,
    private authService: AuthService,
    private router: Router,
  ) {}

  onChannelSubmit(url: string) {
    this.channelUrl = url;
    this.isLoading = true;
    this.errorMessage = '';

    this.verificationService.requestVerification(url).subscribe({
      next: (response) => {
        this.handleOnChannelSubmitSuccess(response);
      },
      error: (error) => {
        this.handleOnChannelSubmitError(error);
      },
    });
  }

  handleOnChannelSubmitSuccess(response: VerificationResponse) {
    this.isLoading = false;
    this.verificationToken =
      'RepliMe Verification: ' + response?.verificationToken;
    this.expirationDate = response?.expirationDateAt;
    this.stepForward();
  }

  handleOnChannelSubmitError(error: any) {
    this.isLoading = false;
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) this.router.navigate(['/auth']);
    this.errorMessage = error?.error?.error ||'Failed to request verification. Please try again.';
  }

  onTokenAdded() {
    this.stepForward();
  }

  onVerificationStart() {
    this.isVerifying = true;
    this.errorMessage = '';

    this.verificationService.confirmVerification().subscribe({
      next: (response) => {
        this.handleOnVerificationStartSuccess();
      },
      error: (error) => {
        this.handleOnVerificationStartError(error);
      },
    });
  }

  handleOnVerificationStartSuccess() {
    this.isVerifying = false;
    this.stepForward();
    this.authService.updateUserRole('INFLUENCER');
  }

  handleOnVerificationStartError(error: any) {
    this.isVerifying = false;
    this.errorMessage = error?.error?.error || 'Verification failed. Please ensure the token is in your channel description and try again.';
  }

  onPersonaSubmit(data: PersonaData) {
    this.stepForward();
  }

  onCompleteChannelVerification() {
    this.isChannelVerificationComplete = true;
    this.currentStep = 0;
  }

  onBack() {
    this.stepBack();
    this.errorMessage = '';
  }

  stepBack() {
    this.currentStep--;
  }

  stepForward() {
    this.currentStep++;
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
