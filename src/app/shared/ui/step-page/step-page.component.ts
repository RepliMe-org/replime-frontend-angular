import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-step-page',
  standalone: true,
  imports: [CommonModule, StepperComponent],
  templateUrl: './step-page.component.html',
  styleUrls: ['./step-page.component.css']
})
export class StepPageComponent {
  @Input() steps: string[] = [];
  @Input() activeStepIndex: number = 0;
  @Input() errorMessage: string = '';
  
  @Output() errorDismissed = new EventEmitter<void>();
}
