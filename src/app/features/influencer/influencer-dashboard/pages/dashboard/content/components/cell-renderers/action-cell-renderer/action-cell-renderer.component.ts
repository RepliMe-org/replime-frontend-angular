import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-action-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-cell-renderer.component.html',
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  hovered = false;
  private videoId: number;
  private onDeleteCallback: (videoId: number) => void;

  agInit(params: ICellRendererParams) {
    this.videoId = params.data?.videoId;
    this.onDeleteCallback = params.context?.onDeleteVideo;
  }

  onDelete() {
    if (this.onDeleteCallback && this.videoId != null) {
      this.onDeleteCallback(this.videoId);
    }
  }

  refresh(): boolean { return false; }
}