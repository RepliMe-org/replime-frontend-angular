import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    this.initTheme();
  }

  applyTheme(theme: Theme) {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    this.isDarkMode.set(theme === 'dark');
    localStorage.setItem('theme', theme);
  }

  initTheme() {
    const saved = localStorage.getItem('theme') as Theme | null;
    this.applyTheme(saved === 'dark' ? 'dark' : 'light');
  }

  toggleTheme() {
    this.applyTheme(this.isDarkMode() ? 'light' : 'dark');
  }
}
