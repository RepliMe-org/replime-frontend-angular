import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-ready-verify-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './ready-verify-step.component.html',
  styleUrl: './ready-verify-step.component.css',
})
export class ReadyVerifyStepComponent {
  @Input() channelUrl = '';
  @Input() verificationToken = '';
  @Input() isVerifying = false;
  @Output() verify = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() startOver = new EventEmitter<void>();

  channelHandle: string = '';

  getChannelHandle() {
    const match = this.channelUrl.match(/@([^/]+)/);
    this.channelHandle = match ? `@${match[1]}` : '';
  }

  onVerifyClick() {
    this.verify.emit();
  }

  onBackClick() {
    this.back.emit();
  }

  onStartOverClick() {
    this.startOver.emit();
  }
}
