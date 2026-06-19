import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';

import { AdminUser } from '../../models/admin-chatbot';
import { UserAdminService } from '../../services/user-admin.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SharedModule } from '../../../../shared/shared.module';
import { DataGridComponent } from '../../../../shared/ui/data-grid/data-grid.component';

import { UserCellComponent } from '../../components/user-cell/user-cell.component';
import { UserRoleBadgeComponent } from '../../components/user-role-badge/user-role-badge.component';
import { UserActionsCellComponent, UserActionsContext } from '../../components/user-actions-cell/user-actions-cell.component';
import { filterByQuery } from '../../../../shared/utils/filter.utils';

type RoleFilter = 'All' | 'Admin' | 'Influencer' | 'User';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [SharedModule, DataGridComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];

  loading = true;
  searchQuery = '';
  activeFilter: RoleFilter = 'All';

  totalUsers = 0;
  activeUsers = 0;
  influencerUsers = 0;
  adminUsers = 0;

  private gridApi: GridApi | null = null;

  columnDefs: ColDef[] = [
    {
      headerName: 'User',
      field: 'username',
      cellRenderer: UserCellComponent,
      flex: 2,
      minWidth: 220,
      sortable: true,
      filter: false,
    },
    {
      headerName: 'Role',
      field: 'role',
      cellRenderer: UserRoleBadgeComponent,
      width: 120,
      sortable: true,
      filter: false,
    },
    {
      headerName: 'Chatbot',
      field: 'chatbotName',
      flex: 1,
      minWidth: 140,
      sortable: true,
      filter: false,
      valueFormatter: (params) => params.value ?? '—',
      cellStyle: { color: 'var(--text-main)', fontSize: '13px' },
    },
    {
      headerName: 'Conversations',
      field: 'conversationsCount',
      width: 150,
      sortable: true,
      filter: false,
      cellStyle: {
        color: 'var(--text-main)',
        fontSize: '13px',
        fontWeight: '500',
      },
      valueFormatter: (params) =>
        params.value != null
          ? Number(params.value).toLocaleString()
          : '0',
    },
    {
      headerName: '',
      field: 'actions',
      cellRenderer: UserActionsCellComponent,
      width: 64,
      sortable: false,
      filter: false,
      pinned: 'right',
      resizable: false,
    },
  ];

  gridContext: UserActionsContext = {
    onDelete: (user) => this.deleteUser(user),
  };

  constructor(
    private userAdminService: UserAdminService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userAdminService.getAllUsers().subscribe({
      next: (res: AdminUser[]) => {
        this.users = res;
        this.calculateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.users = [];
        this.calculateStats();
        this.applyFilters();
        this.toastService.error('Failed to load users');
      },
    });
  }

  calculateStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter((u) => u.status === 'ACTIVE').length;
    this.influencerUsers = this.users.filter((u) => u.role === 'INFLUENCER').length;
    this.adminUsers = this.users.filter((u) => u.role === 'ADMIN').length;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  setFilter(filter: RoleFilter): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.users];

    if (this.activeFilter !== 'All') {
      const roleMap: Record<RoleFilter, string> = {
        All: '',
        Admin: 'ADMIN',
        Influencer: 'INFLUENCER',
        User: 'USER',
      };
      filtered = filtered.filter(
        (u) => u.role === roleMap[this.activeFilter],
      );
    }

    this.filteredUsers = filterByQuery(filtered, this.searchQuery, [
      'username',
      'email',
      'chatbotName',
    ]);
  }

  onGridReady(api: GridApi): void {
    this.gridApi = api;
  }

  deleteUser(user: AdminUser): void {
    this.userAdminService.deleteUser(user.username).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.username !== user.username);
        this.calculateStats();
        this.applyFilters();
        this.toastService.success(`${user.username} deleted`);
      },
      error: () => this.toastService.error('Failed to delete user'),
    });
  }
}