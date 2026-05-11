import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { SyncStatus } from '../../../../../../models/training-source.model'; 


const STATUS_MAP= {
  COMPLETED: {
    label: 'Indexed',
    icon: 'fa-solid fa-circle-check',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
  },
  PROCESSING: {
    label: 'Learning',
    icon: 'fa-solid fa-spinner fa-spin',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
  FAILED: {
    label: 'Failed',
    icon: 'fa-solid fa-circle-xmark',
    color: 'var(--danger)',
    bg: 'rgba(239,67,67,0.12)',
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

  agInit(params: ICellRendererParams) {
    const status: SyncStatus = params.data?.syncStatus;
    this.config = STATUS_MAP[status] ?? null;
  }

  refresh(): boolean { return false; }
}