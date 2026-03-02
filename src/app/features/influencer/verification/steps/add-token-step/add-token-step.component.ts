import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../../shared/shared-imports';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-add-token-step',
  standalone: true,
  imports: [...SHARED_IMPORTS, CardComponent, ButtonComponent],
  templateUrl: './add-token-step.component.html',
  styleUrl: './add-token-step.component.css',
})
export class AddTokenStepComponent {
  @Input() channelUrl = '';
  @Input() verificationToken = '';
  @Input() expirationDate = '';
  @Output() tokenAdded = new EventEmitter<void>();

  channelHandle: string = '';
  instructions = [
    {
      title: 'Go to your YouTube channel',
    },
    {
      title: 'Click "Customize channel"',
    },
    {
      title: 'Paste the token in your Description',
    },
    {
      title: 'Click "Publish" to save changes',
    },
  ];
  tokenCopied = false;

  copyToken() {
    navigator.clipboard.writeText(this.verificationToken);
    this.tokenCopied = true;
    setTimeout(() => {
      this.tokenCopied = false;
    }, 2000);
  }

  getChannelHandle() {
    const match = this.channelUrl.match(/@([^/]+)/);
    this.channelHandle = match ? `@${match[1]}` : '';
  }

  getFormattedExpirationDate(): string {
    if (!this.expirationDate) return '';
    const date = new Date(this.expirationDate);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  onTokenAdded() {
    this.tokenAdded.emit();
  }
}
