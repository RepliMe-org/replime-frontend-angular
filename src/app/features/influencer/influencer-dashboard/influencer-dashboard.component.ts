import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { VerificationContainerComponent } from '../verification/verification-container/verification-container.component';
import { SharedModule } from '../../../shared/shared.module';
import { ChatbotService } from '../services/chatbot.service';

@Component({
  selector: 'app-influencer-dashboard',
  standalone: true,
  imports: [SharedModule, VerificationContainerComponent],
  templateUrl: './influencer-dashboard.component.html',
  styleUrl: './influencer-dashboard.component.css',
})
export class InfluencerDashboardComponent implements OnInit {
  isInfluencer = false;
  isChatbotConfigured = false;
  dashboardState: 'CHANNEL_VERIFICATION' | 'CHATBOT_SETUP' | 'DASHBOARD' = 'CHANNEL_VERIFICATION';

  constructor(
    private authService: AuthService,
    private chatbotService: ChatbotService,
  ) {}

  ngOnInit() {
    this.isInfluencer = this.authService.hasRole('INFLUENCER');

    this.chatbotService.getChatbotConfig().subscribe({
      next: (config) => {
        this.isChatbotConfigured = config?.configId != null;
        this.updateDashboardState();
      },
      error: () => {
        this.isChatbotConfigured = false;
        this.updateDashboardState();
      },
    });
  }

  updateDashboardState(newState?: 'CHANNEL_VERIFICATION' | 'CHATBOT_SETUP' | 'DASHBOARD') {
    if (newState) {
      this.dashboardState = newState;
      return;
    }

    if (!this.isInfluencer) {
      this.dashboardState = 'CHANNEL_VERIFICATION';
    } else if (!this.isChatbotConfigured) {
      this.dashboardState = 'CHATBOT_SETUP';
    } else {
      this.dashboardState = 'DASHBOARD';
    }
  }
}
