import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AdminChatbotsComponent } from './admin-chatbots.component';
import { ChatbotAdminService } from '../../services/chatbot-admin.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AdminChatbot } from '../../models/admin-chatbot';

const mockChatbots: AdminChatbot[] = [
  {
    id: '1',
    influencerUsername: 'alice',
    chatbotName: 'AliceBot',
    chatbotDescription: 'Alice description',
    chatbotCategory: 'Tech',
    greetingMessage: 'Hello!',
    avatarUrl: null,
    channelHandle: '@alice',
    isPublic: true,
    numberOfIngestedVideos: 10,
    status: 'ACTIVE',
  },
  {
    id: '2',
    influencerUsername: 'bob',
    chatbotName: 'BobBot',
    chatbotDescription: 'Bob description',
    chatbotCategory: 'Gaming',
    greetingMessage: 'Hey!',
    avatarUrl: null,
    channelHandle: '@bob',
    isPublic: false,
    numberOfIngestedVideos: 5,
    status: 'TRAINING',
  },
  {
    id: '3',
    influencerUsername: 'carol',
    chatbotName: 'CarolBot',
    chatbotDescription: 'Carol description',
    chatbotCategory: 'Music',
    greetingMessage: 'Hi!',
    avatarUrl: null,
    channelHandle: '@carol',
    isPublic: false,
    numberOfIngestedVideos: 0,
    status: 'FAILED',
  },
];

describe('AdminChatbotsComponent', () => {
  let component: AdminChatbotsComponent;
  let fixture: ComponentFixture<AdminChatbotsComponent>;
  let mockChatbotAdminService: jasmine.SpyObj<ChatbotAdminService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockChatbotAdminService = jasmine.createSpyObj('ChatbotAdminService', [
      'getAllChatbots',
      'updateVisibility',
    ]);
    mockToastService = jasmine.createSpyObj('ToastService', [
      'success',
      'error',
    ]);

    mockChatbotAdminService.getAllChatbots.and.returnValue(of(mockChatbots));
    mockChatbotAdminService.updateVisibility.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [
        AdminChatbotsComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: ChatbotAdminService, useValue: mockChatbotAdminService },
        { provide: ToastService, useValue: mockToastService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminChatbotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadChatbots()', () => {
    it('should populate chatbots and set loading false on success', () => {
      expect(component.chatbots).toEqual(mockChatbots);
      expect(component.loading).toBeFalse();
    });

    it('should call calculateStats and applyFilters after loading', () => {
      spyOn(component, 'calculateStats');
      spyOn(component, 'applyFilters');
      component.loadChatbots();
      expect(component.calculateStats).toHaveBeenCalled();
      expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should set chatbots to [] and call toast.error on failure', () => {
      mockChatbotAdminService.getAllChatbots.and.returnValue(
        throwError(() => new Error('fail')),
      );
      component.loadChatbots();
      expect(component.chatbots).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(mockToastService.error).toHaveBeenCalledWith(
        'Failed to load chatbots',
      );
    });
  });

  describe('calculateStats()', () => {
    it('should set totalChatbots to chatbots.length', () => {
      expect(component.totalChatbots).toBe(3);
    });

    it('should count active chatbots correctly', () => {
      expect(component.activeChatbots).toBe(1);
    });

    it('should count pending chatbots (CONFIGURING or TRAINING)', () => {
      expect(component.pendingChatbots).toBe(1);
    });

    it('should count failed chatbots correctly', () => {
      expect(component.failedChatbots).toBe(1);
    });
  });

  describe('onSearchChange()', () => {
    it('should update searchQuery and apply filters', () => {
      spyOn(component, 'applyFilters');
      component.onSearchChange('alice');
      expect(component.searchQuery).toBe('alice');
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('setFilter()', () => {
    it('should update activeFilter and apply filters', () => {
      spyOn(component, 'applyFilters');
      component.setFilter('Active');
      expect(component.activeFilter).toBe('Active');
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('applyFilters()', () => {
    it('should return all chatbots when filter is All and search is empty', () => {
      component.activeFilter = 'All';
      component.searchQuery = '';
      component.applyFilters();
      expect(component.filteredChatbots.length).toBe(3);
    });

    it('should filter to only ACTIVE chatbots when filter is Active', () => {
      component.activeFilter = 'Active';
      component.searchQuery = '';
      component.applyFilters();
      expect(component.filteredChatbots.length).toBe(1);
      expect(component.filteredChatbots[0].status).toBe('ACTIVE');
    });

    it('should filter to CONFIGURING and TRAINING chatbots when filter is Training', () => {
      component.activeFilter = 'Training';
      component.searchQuery = '';
      component.applyFilters();
      expect(
        component.filteredChatbots.every(
          (c) => c.status === 'CONFIGURING' || c.status === 'TRAINING',
        ),
      ).toBeTrue();
    });

    it('should filter to FAILED chatbots when filter is Failed', () => {
      component.activeFilter = 'Failed';
      component.searchQuery = '';
      component.applyFilters();
      expect(component.filteredChatbots.length).toBe(1);
      expect(component.filteredChatbots[0].status).toBe('FAILED');
    });

    it('should filter by chatbotName when search query is provided', () => {
      component.activeFilter = 'All';
      component.searchQuery = 'Alice';
      component.applyFilters();
      expect(component.filteredChatbots.length).toBe(1);
      expect(component.filteredChatbots[0].chatbotName).toBe('AliceBot');
    });

    it('should filter by influencerUsername when search query matches', () => {
      component.activeFilter = 'All';
      component.searchQuery = 'bob';
      component.applyFilters();
      expect(component.filteredChatbots.length).toBe(1);
      expect(component.filteredChatbots[0].influencerUsername).toBe('bob');
    });
  });

  describe('toggleVisibility()', () => {
    it('should flip isPublic and call updateVisibility with new value', () => {
      const bot = { ...mockChatbots[0], isPublic: true };
      component.toggleVisibility(bot);
      expect(bot.isPublic).toBeFalse();
      expect(mockChatbotAdminService.updateVisibility).toHaveBeenCalledWith(
        '1',
        false,
      );
    });

    it('should show success toast when updateVisibility succeeds', () => {
      const bot = { ...mockChatbots[0], isPublic: false };
      component.toggleVisibility(bot);
      expect(mockToastService.success).toHaveBeenCalledWith(
        'Chatbot visibility enabled',
      );
    });

    it('should revert isPublic and show error toast when updateVisibility fails', () => {
      mockChatbotAdminService.updateVisibility.and.returnValue(
        throwError(() => new Error('fail')),
      );
      const bot = { ...mockChatbots[0], isPublic: true };
      component.toggleVisibility(bot);
      expect(bot.isPublic).toBeTrue();
      expect(mockToastService.error).toHaveBeenCalledWith(
        'Failed to update chatbot visibility',
      );
    });
  });

  describe('trackById()', () => {
    it('should return the bot id', () => {
      expect(component.trackById(0, mockChatbots[0])).toBe('1');
    });
  });
});
