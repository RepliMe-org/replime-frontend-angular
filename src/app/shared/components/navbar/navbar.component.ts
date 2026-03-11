import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  username: string | null = null;
  role: string | null = null;
  showUserMenu = false;
  private routerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.updateAuthState();
    
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateAuthState();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  updateAuthState() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.username = this.authService.getUsername();
    this.role = this.authService.getRole();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.username = null;
    this.role = null;
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }
}
