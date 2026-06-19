import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { UserRole } from '../../models/admin-chatbot';

@Component({
  selector: 'app-user-role-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-role-badge.component.html',
  styleUrls: ['./user-role-badge.component.css'],
})
export class UserRoleBadgeComponent implements ICellRendererAngularComp {
  label = '';
  badgeClass = '';

  agInit(params: ICellRendererParams): void {
    this.setValue(params.value as UserRole);
  }

  refresh(params: ICellRendererParams): boolean {
    this.setValue(params.value as UserRole);
    return true;
  }

  private setValue(role: UserRole) {
    const labels: Record<UserRole, string> = {
      INFLUENCER: 'Influencer',
      ADMIN: 'Admin',
      USER: 'User',
    };
    const map: Record<UserRole, string> = {
      INFLUENCER: 'role-influencer',
      ADMIN: 'role-admin',
      USER: 'role-user',
    };
    this.label = labels[role] ?? role ?? '—';
    this.badgeClass = map[role] ?? 'role-user';
  }
}