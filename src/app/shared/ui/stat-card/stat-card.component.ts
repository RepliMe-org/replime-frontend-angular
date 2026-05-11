import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css'],
})
export class StatCardComponent {
  @Input() value: string | number = '0';
  @Input() label: string = '';
  @Input() iconClass: string = 'fa-solid fa-chart-bar';
  @Input() iconColorClass: string = 'text-cyan bg-cyan/20';
}
