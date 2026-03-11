import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-verification-complete-step',
  standalone: true,
  imports: [SharedModule],
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

  onSetUpChatBot() {
    this.complete.emit();
  }
}
