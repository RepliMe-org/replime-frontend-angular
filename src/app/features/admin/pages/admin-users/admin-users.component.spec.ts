import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { UserAdminService } from '../../services/user-admin.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AdminUser } from '../../models/admin-chatbot';
import { GridApi } from 'ag-grid-community';
import { AdminUsersComponent } from './admin-users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;

  let mockUserAdminService: jasmine.SpyObj<UserAdminService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const mockUsers: AdminUser[] = [
    {
      id: '1',
      username: 'alice',
      email: 'alice@test.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      chatbotName: 'Alice Bot',
      conversationsCount: 100,
    } as any,
    {
      id: '2',
      username: 'bob',
      email: 'bob@test.com',
      role: 'INFLUENCER',
      status: 'ACTIVE',
      chatbotName: 'Bob Bot',
      conversationsCount: 50,
    } as any,
    {
      id: '3',
      username: 'charlie',
      email: 'charlie@test.com',
      role: 'USER',
      status: 'INACTIVE',
      chatbotName: null,
      conversationsCount: 0,
    } as any,
  ];

  beforeEach(async () => {
    mockUserAdminService = jasmine.createSpyObj('UserAdminService', [
      'getAllUsers',
    ]);

    mockToastService = jasmine.createSpyObj('ToastService', [
      'success',
      'error',
    ]);

    mockUserAdminService.getAllUsers.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [
        AdminUsersComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: UserAdminService,
          useValue: mockUserAdminService,
        },
        {
          provide: ToastService,
          useValue: mockToastService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadUsers()', () => {
    it('should load users successfully', () => {
      expect(component.users).toEqual(mockUsers);
      expect(component.filteredUsers).toEqual(mockUsers);
      expect(component.loading).toBeFalse();
    });

    it('should handle load failure', () => {
      mockUserAdminService.getAllUsers.and.returnValue(
        throwError(() => new Error()),
      );

      component.loadUsers();

      expect(component.users).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(mockToastService.error).toHaveBeenCalledWith(
        'Failed to load users',
      );
    });
  });

  describe('calculateStats()', () => {
    it('should calculate statistics correctly', () => {
      expect(component.totalUsers).toBe(3);
      expect(component.activeUsers).toBe(2);
      expect(component.influencerUsers).toBe(1);
      expect(component.adminUsers).toBe(1);
    });
  });

  describe('onSearchChange()', () => {
    it('should update search query and apply filters', () => {
      spyOn(component, 'applyFilters');

      component.onSearchChange('alice');

      expect(component.searchQuery).toBe('alice');
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('setFilter()', () => {
    it('should update filter and apply filters', () => {
      spyOn(component, 'applyFilters');

      component.setFilter('Influencer');

      expect(component.activeFilter).toBe('Influencer');
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('applyFilters()', () => {
    it('should return all users', () => {
      component.activeFilter = 'All';
      component.searchQuery = '';

      component.applyFilters();

      expect(component.filteredUsers.length).toBe(3);
    });

    it('should filter admins', () => {
      component.activeFilter = 'Admin';

      component.applyFilters();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].role).toBe('ADMIN');
    });

    it('should filter influencers', () => {
      component.activeFilter = 'Influencer';

      component.applyFilters();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].role).toBe('INFLUENCER');
    });

    it('should filter users', () => {
      component.activeFilter = 'User';

      component.applyFilters();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].role).toBe('USER');
    });

    it('should filter by username', () => {
      component.activeFilter = 'All';
      component.searchQuery = 'alice';

      component.applyFilters();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].username).toBe('alice');
    });

    it('should filter by email', () => {
      component.activeFilter = 'All';
      component.searchQuery = 'bob@test.com';

      component.applyFilters();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].email).toBe('bob@test.com');
    });

    it('should filter by chatbot name', () => {
      component.activeFilter = 'All';
      component.searchQuery = 'Bob Bot';

      component.applyFilters();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].chatbotName).toBe('Bob Bot');
    });
  });

  describe('onGridReady()', () => {
    it('should store the grid api', () => {
      const api = {} as GridApi;

      component.onGridReady(api);

      expect((component as any).gridApi).toBe(api);
    });
  });
});
