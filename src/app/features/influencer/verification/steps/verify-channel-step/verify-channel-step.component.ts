import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-verify-channel-step',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './verify-channel-step.component.html',
  styleUrls: ['./verify-channel-step.component.css']
})
export class VerifyChannelStepComponent {
  @Input() isLoading = false;
  @Output() channelSubmit = new EventEmitter<string>();
  
  channelUrl = '';
  youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(c\/|channel\/|user\/)?(@[a-zA-Z0-9._-]+|[a-zA-Z0-9_-]+)/;

  isValidUrl(): boolean {
    if (!this.channelUrl) return false;
    return this.youtubeRegex.test(this.channelUrl.trim());
  }

  onSubmit() {
    if (this.isValidUrl() && !this.isLoading) {
      this.channelSubmit.emit(this.channelUrl.trim());
    }
  }
}