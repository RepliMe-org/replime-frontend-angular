import { Component } from '@angular/core';
import { FeaturesSectionComponent } from '../features-section/features-section.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FeaturesSectionComponent, HeroSectionComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
