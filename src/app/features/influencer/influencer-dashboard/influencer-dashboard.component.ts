import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { VerificationContainerComponent } from '../verification/verification-container/verification-container.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-influencer-dashboard',
  standalone: true,
  imports: [SharedModule, VerificationContainerComponent],
  templateUrl: './influencer-dashboard.component.html',
  styleUrl: './influencer-dashboard.component.css',
})
export class InfluencerDashboardComponent implements OnInit {
  isInfluencer = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkInfluencerStatus();
  }

  checkInfluencerStatus() {
    this.isInfluencer = this.authService.hasRole('INFLUENCER');
  }
}