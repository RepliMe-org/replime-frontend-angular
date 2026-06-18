import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { HeroSectionComponent } from './features/landing/components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from './features/landing/components/features-section/features-section.component';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { ThemeService } from './core/services/theme.service';
import { inject } from '@angular/core';

provideGlobalGridOptions({
    theme: "legacy",
});
ModuleRegistry.registerModules([
    AllCommunityModule,
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HeroSectionComponent, FeaturesSectionComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'replime-frontend-angular';
  private themeService = inject(ThemeService);
}
