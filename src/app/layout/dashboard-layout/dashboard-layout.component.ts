import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutService } from '../services/layout.service';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../../shared/components/sidebar-nav/sidebar-nav.component';
import { ADMIN_SIDEBAR_CONFIG, INFLUENCER_SIDEBAR_CONFIG } from '../../shared/components/sidebar-nav/sidebar-configs.const';


@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly layoutService = inject(LayoutService);
  userInfo = this.authService.getUserInfo() ?? {username: '', role: ''};

  sidebarConfig = this.authService.hasRole('ADMIN')
    ? ADMIN_SIDEBAR_CONFIG(this.router, this.authService, this.userInfo)
    : INFLUENCER_SIDEBAR_CONFIG(this.router, this.authService, this.userInfo);
}