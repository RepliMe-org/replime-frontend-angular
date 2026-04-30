import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { SharedModule } from '../../../../../../../shared/shared.module';
import {
  AddSourceMode,
  AddSourcePayload,
} from '../../models/training-source.model';

const VIDEO_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
const PLAYLIST_REGEX =
  /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=[\w-]+/;

const MODE_CONFIG = {
  VIDEO: {
    title: 'Add Video',
    subtitle: 'Paste a YouTube video URL to add it as a learning source.',
    placeholder: 'https://youtu.be/... or https://youtube.com/watch?v=...',
    btnLabel: 'Add Video',
  },
  PLAYLIST: {
    title: 'Add Playlist',
    subtitle: 'Paste a YouTube playlist URL to add it as a learning source.',
    placeholder: 'https://youtube.com/playlist?list=...',
    btnLabel: 'Add Playlist',
  },
};

@Component({
  selector: 'app-add-source-modal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-source-modal.component.html',
  styleUrl: './add-source-modal.component.css',
})
export class AddSourceModalComponent implements OnChanges {
  @Input() show = false;
  @Input() mode: AddSourceMode = 'VIDEO';
  @Input() isLoading = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitSource = new EventEmitter<AddSourcePayload>();

  url = '';
  urlError = '';

  getConfig() {
    return MODE_CONFIG[this.mode];
  }

  ngOnChanges() {
    if (this.show) {
      this.url = '';
      this.urlError = '';
    }
  }

  close() {
    this.url = '';
    this.urlError = '';
    this.closeModal.emit();
  }

  submit() {
    this.urlError = '';
    if (!this.url.trim()) {
      this.urlError = 'URL is required.';
      return;
    }

    const regex = this.mode === 'PLAYLIST' ? PLAYLIST_REGEX : VIDEO_REGEX;
    if (!regex.test(this.url.trim())) {
      this.urlError =
        this.mode === 'PLAYLIST'
          ? 'Enter a valid YouTube playlist URL.'
          : 'Enter a valid YouTube video URL.';
      return;
    }

    this.submitSource.emit({
      sourceValue: this.url.trim(),
      sourceType: this.mode,
    });
  }
}
