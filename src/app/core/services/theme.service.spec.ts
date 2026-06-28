import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';

    TestBed.configureTestingModule({ providers: [ThemeService] });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  describe('applyTheme()', () => {
    it('should add "dark" class to body and update signal when theme is dark', () => {
      service.applyTheme('dark');

      expect(document.body.classList.contains('dark')).toBeTrue();
      expect(document.body.classList.contains('light')).toBeFalse();
      expect(service.isDarkMode()).toBeTrue();
    });

    it('should add "light" class to body and update signal when theme is light', () => {
      service.applyTheme('light');

      expect(document.body.classList.contains('light')).toBeTrue();
      expect(document.body.classList.contains('dark')).toBeFalse();
      expect(service.isDarkMode()).toBeFalse();
    });

    it('should persist theme to localStorage', () => {
      service.applyTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      service.applyTheme('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should remove previous theme class before adding new one', () => {
      service.applyTheme('dark');
      service.applyTheme('light');

      expect(document.body.classList.contains('dark')).toBeFalse();
      expect(document.body.classList.contains('light')).toBeTrue();
    });
  });

  describe('initTheme()', () => {
    it('should load dark theme from localStorage when previously saved', () => {
      localStorage.setItem('theme', 'dark');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ThemeService] });
      const freshService = TestBed.inject(ThemeService);

      expect(freshService.isDarkMode()).toBeTrue();
      expect(document.body.classList.contains('dark')).toBeTrue();
    });

    it('should fall back to light theme when localStorage has no saved theme', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [ThemeService] });
      const freshService = TestBed.inject(ThemeService);

      expect(freshService.isDarkMode()).toBeFalse();
      expect(document.body.classList.contains('light')).toBeTrue();
    });
  });

  describe('toggleTheme()', () => {
    it('should switch from light to dark', () => {
      service.applyTheme('light');
      service.toggleTheme();

      expect(service.isDarkMode()).toBeTrue();
      expect(document.body.classList.contains('dark')).toBeTrue();
    });

    it('should switch from dark to light', () => {
      service.applyTheme('dark');
      service.toggleTheme();

      expect(service.isDarkMode()).toBeFalse();
      expect(document.body.classList.contains('light')).toBeTrue();
    });
  });
});
