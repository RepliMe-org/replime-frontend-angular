import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {

}
