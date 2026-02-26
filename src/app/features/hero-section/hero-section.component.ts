import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent {

}
