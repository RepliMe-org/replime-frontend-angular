import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../../shared/shared-imports';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-verification-complete-step',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './verification-complete-step.component.html',
  styleUrl: './verification-complete-step.component.css',
})
export class VerificationCompleteStepComponent {
  @Input() channelUrl = '';
  @Output() complete = new EventEmitter<void>();

  channelHandle: string = '';

  getChannelHandle() {
    const match = this.channelUrl.match(/@([^/]+)/);
    this.channelHandle = match ? `@${match[1]}` : '';
  }

  onGoToDashboardClick() {
    this.complete.emit();
  }
}
