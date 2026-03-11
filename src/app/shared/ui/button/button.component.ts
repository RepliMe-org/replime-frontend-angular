import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: string = 'default';
  @Input() size: string = 'default';
  @Input() disabled: boolean = false;

  getClasses() {
    return `btn btn-${this.variant} btn-${this.size === 'default' ? 'default-size' : this.size}`;
  }
} 