import { Component } from '@angular/core';
import { FeaturesSectionComponent } from '../../components/features-section/features-section.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { CategoriesSectionComponent } from '../../components/categories-section/categories-section.component';
import { TrendingSectionComponent } from '../../components/trending-section/trending-section.component';
import { HowItWorksSectionComponent } from '../../components/how-it-works-section/how-it-works-section.component';
import { ForCreatorsSectionComponent } from '../../components/for-creators-section/for-creators-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FeaturesSectionComponent,
    HeroSectionComponent,
    NavbarComponent,
    CategoriesSectionComponent,
    TrendingSectionComponent,
    HowItWorksSectionComponent,
    ForCreatorsSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
