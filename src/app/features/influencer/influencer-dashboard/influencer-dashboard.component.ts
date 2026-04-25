import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { VerificationContainerComponent } from '../verification/verification-container/verification-container.component';
import { SharedModule } from '../../../shared/shared.module';
import { ChatbotService } from '../services/chatbot.service';
import { LayoutService } from '../../../layout/layout.service';

@Component({
  selector: 'app-influencer-dashboard',
  standalone: true,
  imports: [SharedModule, VerificationContainerComponent],
  templateUrl: './influencer-dashboard.component.html',
  styleUrl: './influencer-dashboard.component.css',
})
export class InfluencerDashboardComponent implements OnInit, OnDestroy {
  isInfluencer = false;
  isChatbotConfigured = false;
  isLoading = true;
  dashboardState: 'CHANNEL_VERIFICATION' | 'CHATBOT_SETUP' | 'DASHBOARD' = 'CHANNEL_VERIFICATION';

  constructor(
    private authService: AuthService,
    private chatbotService: ChatbotService,
    private layoutService: LayoutService,
  ) {}

  ngOnInit() {
    this.layoutService.setShowSidebar(false);
    this.isInfluencer = this.authService.hasRole('INFLUENCER');

    this.chatbotService.getChatbotConfig().subscribe({
      next: (config) => {
        this.isChatbotConfigured = config?.configId != null;
        this.updateDashboardState();
        this.isLoading = false;
      },
      error: () => {
        this.isChatbotConfigured = false;
        this.updateDashboardState();
        this.isLoading = false;
      },
    });
  }

  updateDashboardState(newState?: 'CHANNEL_VERIFICATION' | 'CHATBOT_SETUP' | 'DASHBOARD') {
    if (newState) {
      this.dashboardState = newState;
    } else if (!this.isInfluencer) {
      this.dashboardState = 'CHANNEL_VERIFICATION';
    } else if (!this.isChatbotConfigured) {
      this.dashboardState = 'CHATBOT_SETUP';
    } else {
      this.dashboardState = 'DASHBOARD';
    }
    
    this.layoutService.setShowSidebar(this.dashboardState === 'DASHBOARD');
  }

  ngOnDestroy() {
    this.layoutService.setShowSidebar(true);
  }
}
