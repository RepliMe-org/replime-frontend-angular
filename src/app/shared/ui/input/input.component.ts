import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() label?: string;
  @Input() size: string = 'default';
  @Input() width: string = 'full';
  @Input() disabled: boolean = false;
  @Input() textarea: boolean = false;
  @Input() rows: number = 4;
  @Input() error: boolean = false;

  getClasses(): string {
    return `
      input
      input-${this.size}
      input-${this.width}
      ${this.textarea ? 'input-textarea' : ''}
      ${this.error ? 'input-error' : ''}
    `;
  }
}
