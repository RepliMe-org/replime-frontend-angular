import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AdminUser } from '../../models/admin-chatbot';

@Component({
  selector: 'app-user-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-cell.component.html',
  styleUrls: ['./user-cell.component.scss'],
})
export class UserCellComponent implements ICellRendererAngularComp {
  username = '';
  email = '';
  avatarUrl = '';
  initials = '';

  agInit(params: ICellRendererParams): void {
    this.setValue(params.data as AdminUser);
  }

  refresh(params: ICellRendererParams): boolean {
    this.setValue(params.data as AdminUser);
    return true;
  }

  private setValue(user: AdminUser) {
    this.username = user?.username ?? '';
    this.email = user?.email ?? '';
    this.avatarUrl = user?.avatarUrl ?? '';
    this.initials = this.getInitials(this.username || this.email);
  }

  private getInitials(value: string): string {
    if (!value) return '?';
    const namePart = value.split('@')[0];
    const segments = namePart.split(/[._-]/).filter(Boolean);
    if (segments.length >= 2) {
      return (segments[0][0] + segments[1][0]);
    }
    return namePart.slice(0, 2);
  }
}