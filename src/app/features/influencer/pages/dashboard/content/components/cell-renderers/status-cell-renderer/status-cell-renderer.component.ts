import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { SyncStatus } from '../../../../../../models/training-source.model';

const STATUS_MAP = {
  COMPLETED: {
    label: 'Indexed',
    icon: 'fa-solid fa-circle-check',
    color: '#22c55e',
    bg: '#22c55e1f',
  },
  PROCESSING: {
    label: 'Learning',
    icon: 'fa-solid fa-spinner fa-spin',
    color: '#f59e0b',
    bg: '#f59e0b1f',
  },
  FAILED: {
    label: 'Failed',
    icon: 'fa-solid fa-circle-xmark',
    color: 'var(--danger)',
    bg: '#ef43431f',
  },
  DEAD: {
    label: 'Failed',
    icon: 'fa-solid fa-circle-xmark',
    color: 'var(--danger)',
    bg: '#ef43431f',
  },
};

@Component({
  selector: 'app-status-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-cell-renderer.component.html',
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  config = null;
  failureReason: string | null = null;

  agInit(params: ICellRendererParams) {
    const status: SyncStatus = params.data?.syncStatus;
    this.config = STATUS_MAP[status] ?? null;

    this.failureReason = params.data?.failureReason != 'null' ? params.data?.failureReason : null;
  }

  refresh(): boolean {
    return false;
  }
}