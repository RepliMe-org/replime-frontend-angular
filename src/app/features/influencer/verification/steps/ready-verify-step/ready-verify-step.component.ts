import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../../shared/shared-imports';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-ready-verify-step',
  standalone: true,
  imports: [...SHARED_IMPORTS, CardComponent, ButtonComponent],
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
