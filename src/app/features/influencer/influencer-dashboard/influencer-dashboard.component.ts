import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { VerificationContainerComponent } from '../verification/verification-container/verification-container.component';

@Component({
  selector: 'app-influencer-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS, VerificationContainerComponent],
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