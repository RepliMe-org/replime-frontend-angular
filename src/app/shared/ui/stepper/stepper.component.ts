import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared-imports';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent {

  @Input() steps: string[] = [];
  @Input() activeStepIndex: number = 0;
  @Input() clickable: boolean = false;

  @Output() stepChange = new EventEmitter<number>();

  isStepCompleted(index: number): boolean {
    return index < this.activeStepIndex;
  }

  isStepActive(index: number): boolean {
    return index === this.activeStepIndex;
  }

  onStepClick(index: number) {
    if (this.clickable) {
      this.stepChange.emit(index);
    }
  }
}