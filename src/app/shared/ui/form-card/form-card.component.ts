import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css']
})
export class FormCardComponent {
  @Input() title: string = '';
  @Input() errorMessage: string = '';
  @Input() saving: boolean = false;
  @Input() saveText: string = 'Save';
  @Input() savingText: string = 'Saving…';
  
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
