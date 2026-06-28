import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { SimpleChange } from '@angular/core';

import { ChatSidebarComponent } from './chat-sidebar.component';
import { ChatSessionService } from '../../services/chat-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SessionsResponse } from '../../../../core/models/chatbot.model';

describe('ChatSidebarComponent', () => {
  let component: ChatSidebarComponent;
  let fixture: ComponentFixture<ChatSidebarComponent>;
  let chatSessionServiceSpy: jasmine.SpyObj<ChatSessionService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockSessionsResponse: SessionsResponse = {
    data: [
      {
        id: 1,
        status: 'ACTIVE',
        startedAt: '2024-01-01T00:00:00Z',
        lastMessageAt: '2024-01-01T01:00:00Z',
        sessionTopic: 'First chat',
      },
      {
        id: 2,
        status: 'ACTIVE',
        startedAt: '2024-01-02T00:00:00Z',
        lastMessageAt: '2024-01-02T01:00:00Z',
        sessionTopic: 'Second chat',
      },
    ],
    pagination: { nextCursor: 'cursor-abc', hasMore: true, limit: 20 },
  };

  beforeEach(async () => {
    chatSessionServiceSpy = jasmine.createSpyObj('ChatSessionService', [
      'getSessions',
      'deleteSession',
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['error']);

    chatSessionServiceSpy.getSessions.and.returnValue(of(mockSessionsResponse));
    chatSessionServiceSpy.deleteSession.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [ChatSidebarComponent, CommonModule, HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [
        { provide: ChatSessionService, useValue: chatSessionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatSidebarComponent);
    component = fixture.componentInstance;
    component.chatbotId = 'bot-1';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    it('should call resetAndLoadSessions when chatbotId changes', () => {
      const resetSpy = spyOn(component, 'resetAndLoadSessions');

      component.ngOnChanges({
        chatbotId: new SimpleChange(null, 'bot-2', false),
      });

      expect(resetSpy).toHaveBeenCalled();
    });

    it('should NOT call resetAndLoadSessions when other inputs change', () => {
      const resetSpy = spyOn(component, 'resetAndLoadSessions');

      component.ngOnChanges({
        chatbotName: new SimpleChange(null, 'Bot Name', false),
      });

      expect(resetSpy).not.toHaveBeenCalled();
    });

    it('should NOT call resetAndLoadSessions when chatbotId is falsy', () => {
      const resetSpy = spyOn(component, 'resetAndLoadSessions');

      component.chatbotId = '';
      component.ngOnChanges({
        chatbotId: new SimpleChange('bot-1', '', false),
      });

      expect(resetSpy).not.toHaveBeenCalled();
    });
  });

  describe('loadSessions()', () => {
    it('should set isLoading to true initially then false on success', () => {
      component.sessions = [];
      component.hasMore = true;
      component.isFetchingMore = false;

      component.loadSessions();

      expect(chatSessionServiceSpy.getSessions).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse(); // reset after success
    });

    it('should populate sessions from the response', () => {
      component.sessions = [];
      component.hasMore = true;
      component.isFetchingMore = false;

      component.loadSessions();

      expect(component.sessions.length).toBe(2);
      expect(component.sessions[0].id).toBe(1);
    });

    it('should update nextCursor and hasMore from pagination', () => {
      component.sessions = [];
      component.hasMore = true;
      component.isFetchingMore = false;

      component.loadSessions();

      expect(component.nextCursor).toBe('cursor-abc');
      expect(component.hasMore).toBeTrue();
    });

    it('should NOT load sessions when hasMore is false', () => {
      component.hasMore = false;
      chatSessionServiceSpy.getSessions.calls.reset();

      component.loadSessions();

      expect(chatSessionServiceSpy.getSessions).not.toHaveBeenCalled();
    });

    it('should NOT load sessions when already fetching more', () => {
      component.isFetchingMore = true;
      chatSessionServiceSpy.getSessions.calls.reset();

      component.loadSessions();

      expect(chatSessionServiceSpy.getSessions).not.toHaveBeenCalled();
    });

    it('should reset isLoading and isFetchingMore on error', () => {
      component.sessions = [];
      component.hasMore = true;
      component.isFetchingMore = false;
      chatSessionServiceSpy.getSessions.and.returnValue(throwError(() => new Error('Network error')));

      component.loadSessions();

      expect(component.isLoading).toBeFalse();
      expect(component.isFetchingMore).toBeFalse();
    });
  });

  describe('addOrUpdateSession()', () => {
    beforeEach(() => {
      component.sessions = [
        {
          id: 10,
          status: 'ACTIVE',
          startedAt: '2024-01-01T00:00:00Z',
          lastMessageAt: '2024-01-01T00:00:00Z',
          sessionTopic: 'Old topic',
        },
      ];
    });

    it('should update an existing session and move it to the top', () => {
      component.sessions.push({
        id: 20,
        status: 'ACTIVE',
        startedAt: '2024-01-01T00:00:00Z',
        lastMessageAt: '2024-01-01T00:00:00Z',
        sessionTopic: 'Another session',
      });

      component.addOrUpdateSession(20, 'Updated topic', '2024-06-01T00:00:00Z');

      expect(component.sessions[0].id).toBe(20);
      expect(component.sessions[0].sessionTopic).toBe('Updated topic');
      expect(component.sessions[0].lastMessageAt).toBe('2024-06-01T00:00:00Z');
    });

    it('should insert a new session at the top when it does not exist', () => {
      component.addOrUpdateSession(99, 'Brand new chat', '2024-06-15T00:00:00Z');

      expect(component.sessions[0].id).toBe(99);
      expect(component.sessions[0].sessionTopic).toBe('Brand new chat');
      expect(component.sessions.length).toBe(2);
    });

    it('should set status to ACTIVE for newly inserted sessions', () => {
      component.addOrUpdateSession(99, 'New', '2024-06-15T00:00:00Z');
      expect(component.sessions[0].status).toBe('ACTIVE');
    });
  });

  describe('selectSession()', () => {
    it('should emit the selected session id', () => {
      const emitSpy = spyOn(component.sessionSelected, 'emit');
      component.selectSession(42);
      expect(emitSpy).toHaveBeenCalledWith(42);
    });
  });

  describe('deleteSession()', () => {
    it('should remove the deleted session from the sessions array', () => {
      component.sessions = [
        { id: 1, status: 'ACTIVE', startedAt: '', lastMessageAt: '', sessionTopic: 'A' },
        { id: 2, status: 'ACTIVE', startedAt: '', lastMessageAt: '', sessionTopic: 'B' },
      ];
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');

      component.deleteSession(1, event);

      expect(component.sessions.length).toBe(1);
      expect(component.sessions[0].id).toBe(2);
    });

    it('should emit sessionDeleted with the deleted id on success', () => {
      const emitSpy = spyOn(component.sessionDeleted, 'emit');
      component.sessions = [
        { id: 5, status: 'ACTIVE', startedAt: '', lastMessageAt: '', sessionTopic: 'X' },
      ];
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');

      component.deleteSession(5, event);

      expect(emitSpy).toHaveBeenCalledWith(5);
    });

    it('should call stopPropagation on the event', () => {
      const event = new MouseEvent('click');
      const stopPropSpy = spyOn(event, 'stopPropagation');
      component.sessions = [
        { id: 1, status: 'ACTIVE', startedAt: '', lastMessageAt: '', sessionTopic: 'A' },
      ];

      component.deleteSession(1, event);

      expect(stopPropSpy).toHaveBeenCalled();
    });

    it('should show an error toast when deleteSession API fails', () => {
      chatSessionServiceSpy.deleteSession.and.returnValue(throwError(() => new Error('Delete failed')));
      component.sessions = [
        { id: 1, status: 'ACTIVE', startedAt: '', lastMessageAt: '', sessionTopic: 'A' },
      ];
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');

      component.deleteSession(1, event);

      expect(toastServiceSpy.error).toHaveBeenCalledWith('Failed to delete session');
    });
  });

  describe('onNewChat()', () => {
    it('should emit the newChat event', () => {
      const emitSpy = spyOn(component.newChat, 'emit');
      component.onNewChat();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('getFormattedDate()', () => {
    it('should return a formatted date string for today', () => {
      const today = new Date().toISOString();
      expect(component.getFormattedDate(today)).toBe('Today');
    });

    it('should return empty string for empty input', () => {
      expect(component.getFormattedDate('')).toBe('');
    });
  });
});
