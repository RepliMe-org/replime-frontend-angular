import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type CardVariant = 'default' | 'feature' | 'creator' | 'cta';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
}
