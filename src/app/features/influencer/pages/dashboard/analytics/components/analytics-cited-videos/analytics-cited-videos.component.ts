import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitedVideo } from '../../../../../models/analytics.model';

@Component({
  selector: 'app-analytics-cited-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-cited-videos.component.html',
  styleUrl: './analytics-cited-videos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsCitedVideosComponent {
  @Input({ required: true }) videos: CitedVideo[] = [];

  youtubeUrl(videoId: string): string {
    return `https://youtu.be/${videoId}`;
  }

  thumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  maxCitations(): number {
    if (!this.videos?.length) return 1;
    return Math.max(...this.videos.map((v) => v.count), 1);
  }

  hideBrokenThumbnail(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
