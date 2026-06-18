import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle-btn" (click)="themeService.toggleTheme()" [attr.aria-label]="'Toggle theme'">
      <i class="fa-solid" [class.fa-moon]="!themeService.isDarkMode()" [class.fa-sun]="themeService.isDarkMode()"></i>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      background: var(--subtle-bg);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .theme-toggle-btn:hover {
      background: var(--primary-subtle);
      color: var(--primary);
      border-color: var(--primary);
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
