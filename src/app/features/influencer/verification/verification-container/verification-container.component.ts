import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { VerifyChannelStepComponent } from '../steps/verify-channel-step/verify-channel-step.component';
import { AddTokenStepComponent } from '../steps/add-token-step/add-token-step.component';
import { ReadyVerifyStepComponent } from '../steps/ready-verify-step/ready-verify-step.component';
import { VerificationCompleteStepComponent } from '../steps/verification-complete-step/verification-complete-step.component';
import { VerificationService } from '../verification.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { VerificationResponse } from '../verification.model';

@Component({
  selector: 'app-verification-container',
  standalone: true,
  imports: [
    SharedModule,
    VerifyChannelStepComponent,
    AddTokenStepComponent,
    ReadyVerifyStepComponent,
    VerificationCompleteStepComponent,
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

  steps = ['Verify Channel', 'Add Token', 'Confirm', 'Complete'];

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
      'RepliMe Verification: ' + response.verificationToken;
    this.expirationDate = response.expirationDateAt;
    this.currentStep = 1;
  }

  handleOnChannelSubmitError(error: any) {
    this.isLoading = false;
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) this.router.navigate(['/auth']);
    this.errorMessage = error?.error?.error ||'Failed to request verification. Please try again.';
  }

  onTokenAdded() {
    this.currentStep = 2;
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
    this.currentStep = 3;
    this.authService.updateUserRole('INFLUENCER');
  }

  handleOnVerificationStartError(error: any) {
    this.isVerifying = false;
    this.errorMessage = error?.error?.error || 'Verification failed. Please ensure the token is in your channel description and try again.';
  }

  onComplete() {
    window.location.reload();
  }

  onBack(step: number) {
    this.currentStep = step;
    this.errorMessage = '';
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
