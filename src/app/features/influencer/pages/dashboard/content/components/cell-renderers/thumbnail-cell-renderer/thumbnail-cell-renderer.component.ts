import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-thumbnail-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thumbnail-cell-renderer.component.html',
})
export class ThumbnailCellRendererComponent implements ICellRendererAngularComp {
  thumbnail = null;

  agInit(params: ICellRendererParams) {
    this.thumbnail = params.data?.thumbnail ?? null;
  }

  refresh(): boolean { return false; }
}