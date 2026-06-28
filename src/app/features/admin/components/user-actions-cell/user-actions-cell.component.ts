import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AdminUser } from '../../models/admin-chatbot';

export interface UserActionsContext {
  onDelete: (user: AdminUser) => void;
}

@Component({
  selector: 'app-user-actions-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-actions-cell.component.html',
  styleUrls: ['./user-actions-cell.component.css'],
})
export class UserActionsCellComponent implements ICellRendererAngularComp {
  private user: AdminUser | null = null;
  private context!: UserActionsContext;

  agInit(params: ICellRendererParams): void {
    this.user = params.data as AdminUser;
    this.context = params.context as UserActionsContext;
  }

  refresh(params: ICellRendererParams): boolean {
    this.user = params.data as AdminUser;
    return true;
  }

  onDelete() {
    if (this.user) {
      this.context?.onDelete(this.user);
    }
  }
}