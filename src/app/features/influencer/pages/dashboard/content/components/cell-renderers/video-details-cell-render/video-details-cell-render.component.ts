import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-video-details-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-details-cell-render.component.html',
})
export class VideoDetailsCellRendererComponent implements ICellRendererAngularComp {
  title = '';
  youtubeUrl = '';
  duration = '';

  agInit(params: ICellRendererParams) {
    const data = params.data;
    this.title = data?.title ?? '—';
    this.youtubeUrl = data?.youtubeVideoId
      ? `https://youtu.be/${data.youtubeVideoId}`
      : '';
    this.duration = data?.duration ?? '';
  }

  refresh(): boolean {
    return false;
  }
}
