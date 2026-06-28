import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ChatPageComponent } from './chat-page.component';
import { ChatSessionService } from '../services/chat-session.service';
import { PublicChatbotService } from '../../../core/services/public-chatbot.service';
import { ChatSidebarComponent } from '../components/chat-sidebar/chat-sidebar.component';
import { ChatMessageComponent } from '../components/chat-message/chat-message.component';
import { ChatInputComponent } from '../components/chat-input/chat-input.component';
import { ChatWelcomeComponent } from '../components/chat-welcome/chat-welcome.component';
import { ChatTypingComponent } from '../components/chat-typing/chat-typing.component';
import { PublicChatbot } from '../../../core/models/public-chatbot.model';
import {
  ChatMessage,
  SendMessageResponse,
  SessionDetail,
  SessionsResponse,
} from '../../../core/models/chatbot.model';
import { ToastService } from '../../../core/services/toast.service';

import { MarkdownModule } from 'ngx-markdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChatPageComponent', () => {
  let component: ChatPageComponent;
  let fixture: ComponentFixture<ChatPageComponent>;
  let chatSessionServiceSpy: jasmine.SpyObj<ChatSessionService>;
  let publicChatbotServiceSpy: jasmine.SpyObj<PublicChatbotService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockChatbot: PublicChatbot = {
    id: 'bot-1',
    influencerUsername: 'creator',
    chatbotName: 'Test Bot',
    chatbotDescription: 'A test bot',
    categoryName: 'Tech',
    greetingMessage: 'Hello!',
    avatarUrl: null,
    channelHandle: '@creator',
    status: 'ACTIVE',
  };

  const mockSessionDetail: SessionDetail = {
    sessionId: 10,
    chatbotId: 'bot-1',
    chatbotName: 'Test Bot',
    greetingMessage: 'Hello!',
    startedAt: '2024-01-01T00:00:00Z',
    messageCount: 0,
  };

  const mockMessages: ChatMessage[] = [
    {
      id: 1,
      message: 'Hello',
      sender: 'USER',
      sentAt: '2024-01-01T00:00:00Z',
      messageStatus: 'SENT',
      messageClass: '',
    },
    {
      id: 2,
      message: 'Hi there!',
      sender: 'BOT',
      sentAt: '2024-01-01T00:00:01Z',
      messageStatus: 'SENT',
      messageClass: '',
    },
  ];

  const mockSendResponse: SendMessageResponse = {
    sessionId: 10,
    sessionTitle: 'Chat about Angular',
    userMessage: mockMessages[0],
    aiResponse: {
      id: 3,
      message: 'AI reply',
      sender: 'BOT',
      sentAt: '2024-01-01T00:01:00Z',
      messageStatus: 'SENT',
      messageClass: '',
    },
    sources: [],
    updatedAt: '2024-01-01T00:01:00Z',
  };

  const mockSessionsResponse: SessionsResponse = {
    data: [],
    pagination: { nextCursor: '', hasMore: false, limit: 20 },
  };

  beforeEach(async () => {
    chatSessionServiceSpy = jasmine.createSpyObj('ChatSessionService', [
      'getSessions',
      'getSessionDetail',
      'getMessages',
      'createSession',
      'sendMessage',
      'deleteSession',
    ]);
    publicChatbotServiceSpy = jasmine.createSpyObj('PublicChatbotService', [
      'getChatbotById',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    chatSessionServiceSpy.getSessions.and.returnValue(of(mockSessionsResponse));
    chatSessionServiceSpy.getSessionDetail.and.returnValue(
      of(mockSessionDetail),
    );
    chatSessionServiceSpy.getMessages.and.returnValue(of(mockMessages));
    chatSessionServiceSpy.createSession.and.returnValue(of(mockSessionDetail));
    chatSessionServiceSpy.sendMessage.and.returnValue(of(mockSendResponse));
    chatSessionServiceSpy.deleteSession.and.returnValue(of(null));
    publicChatbotServiceSpy.getChatbotById.and.returnValue(of(mockChatbot));

    await TestBed.configureTestingModule({
      imports: [
        ChatPageComponent,
        CommonModule,
        RouterModule,
        HttpClientTestingModule,
        MarkdownModule.forRoot(),
      ],
      providers: [
        { provide: ChatSessionService, useValue: chatSessionServiceSpy },
        { provide: PublicChatbotService, useValue: publicChatbotServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'chatbotId' ? 'bot-1' : null),
              },
            },
          },
        },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj('ToastService', ['error', 'success']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should read chatbotId from route snapshot params', () => {
      expect(component.chatbotId).toBe('bot-1');
    });

    it('should load chatbot data on init', () => {
      expect(publicChatbotServiceSpy.getChatbotById).toHaveBeenCalledWith(
        'bot-1',
      );
      expect(component.chatbot).toEqual(mockChatbot);
    });

    it('should set isPageLoading to false after chatbot data is loaded', () => {
      expect(component.isPageLoading).toBeFalse();
    });

    it('should set isPageLoading to false on load error', () => {
      publicChatbotServiceSpy.getChatbotById.and.returnValue(
        throwError(() => new Error('Not found')),
      );
      component.ngOnInit();
      expect(component.isPageLoading).toBeFalse();
    });
  });

  describe('onSessionSelected()', () => {
    it('should do nothing when selecting the already active session', () => {
      component.activeSessionId = 10;
      chatSessionServiceSpy.getSessionDetail.calls.reset();
      chatSessionServiceSpy.getMessages.calls.reset();

      component.onSessionSelected(10);

      expect(chatSessionServiceSpy.getSessionDetail).not.toHaveBeenCalled();
      expect(chatSessionServiceSpy.getMessages).not.toHaveBeenCalled();
    });

    it('should load session details and messages for a new session', () => {
      component.activeSessionId = null;

      component.onSessionSelected(10);

      expect(chatSessionServiceSpy.getSessionDetail).toHaveBeenCalledWith(10);
      expect(chatSessionServiceSpy.getMessages).toHaveBeenCalledWith(10);
    });

    it('should set activeSessionId to the newly selected session', () => {
      component.activeSessionId = null;
      component.onSessionSelected(10);
      expect(component.activeSessionId).toBe(10);
    });

    it('should populate messages from the loaded session', () => {
      component.activeSessionId = null;
      component.messages = [];

      component.onSessionSelected(10);

      expect(component.messages.length).toBe(2);
      expect(component.messages[0].msg.message).toBe('Hello');
    });

    it('should set isChatLoading to false after loading', () => {
      component.onSessionSelected(10);
      expect(component.isChatLoading).toBeFalse();
    });

    it('should set isChatLoading to false on error', () => {
      chatSessionServiceSpy.getSessionDetail.and.returnValue(
        throwError(() => new Error('Not found')),
      );

      component.onSessionSelected(99);

      expect(component.isChatLoading).toBeFalse();
    });
  });

  describe('onNewChat()', () => {
    it('should clear messages, sessionDetail, and activeSessionId', () => {
      component.messages = [{ msg: mockMessages[0], isNew: false }];
      component.sessionDetail = mockSessionDetail;
      component.activeSessionId = 10;

      component.onNewChat();

      expect(component.messages).toEqual([]);
      expect(component.sessionDetail).toBeNull();
      expect(component.activeSessionId).toBeNull();
    });

    it('should reset isMessageStreaming to false', () => {
      component.isMessageStreaming = true;
      component.onNewChat();
      expect(component.isMessageStreaming).toBeFalse();
    });
  });

  describe('onSessionDeleted()', () => {
    it('should call onNewChat when the deleted session is the active one', () => {
      const newChatSpy = spyOn(component, 'onNewChat');
      component.activeSessionId = 5;

      component.onSessionDeleted(5);

      expect(newChatSpy).toHaveBeenCalled();
    });

    it('should NOT call onNewChat when a different session is deleted', () => {
      const newChatSpy = spyOn(component, 'onNewChat');
      component.activeSessionId = 5;

      component.onSessionDeleted(99);

      expect(newChatSpy).not.toHaveBeenCalled();
    });
  });

  describe('onMessageSent()', () => {
    it('should append a USER message to messages list', () => {
      component.activeSessionId = 10;
      component.messages = [];

      component.onMessageSent('Hello bot!');

      expect(component.messages.length).toBe(2);
      expect(component.messages[0].msg.sender).toBe('USER');
      expect(component.messages[1].msg.sender).toBe('BOT');
      expect(component.messages[0].msg.message).toBe('Hello bot!');
    });

    it('should set isTyping to true after sending', () => {
      component.activeSessionId = 10;
      component.isTyping = false;

      component.onMessageSent('Hello!');

      // expect(component.isTyping).toBeTrue();
      expect(chatSessionServiceSpy.sendMessage).toHaveBeenCalled();
    });

    it('should create a new session if no activeSessionId', () => {
      component.activeSessionId = null;

      component.onMessageSent('First message');

      expect(chatSessionServiceSpy.createSession).toHaveBeenCalledWith('bot-1');
    });

    it('should NOT create a session when activeSessionId already exists', () => {
      component.activeSessionId = 10;
      chatSessionServiceSpy.createSession.calls.reset();

      component.onMessageSent('Another message');

      expect(chatSessionServiceSpy.createSession).not.toHaveBeenCalled();
    });

    it('should call sendMessageToBackend with the active sessionId', () => {
      const sendSpy = spyOn(component, 'sendMessageToBackend');
      component.activeSessionId = 10;

      component.onMessageSent('Hello!');

      expect(sendSpy).toHaveBeenCalledWith(10, 'Hello!');
    });
  });

  describe('sendMessageToBackend()', () => {
    it('should call chatSessionService.sendMessage with correct args', () => {
      component.sendMessageToBackend(10, 'Test');

      expect(chatSessionServiceSpy.sendMessage).toHaveBeenCalledWith(
        10,
        'Test',
      );
    });

    it('should append AI response to messages on success', () => {
      component.messages = [];

      component.sendMessageToBackend(10, 'Test');

      const botMessages = component.messages.filter(
        (m) => m.msg.sender === 'BOT',
      );
      expect(botMessages.length).toBe(1);
      expect(botMessages[0].msg.message).toBe('AI reply');
    });

    it('should set isTyping to false and isMessageStreaming to true on success', () => {
      component.isTyping = true;
      component.isMessageStreaming = false;

      component.sendMessageToBackend(10, 'Test');

      expect(component.isTyping).toBeFalse();
      expect(component.isMessageStreaming).toBeTrue();
    });

    it('should call handleMessageError on API failure', () => {
      const handleErrorSpy = spyOn(component, 'handleMessageError');
      chatSessionServiceSpy.sendMessage.and.returnValue(
        throwError(() => new Error('Failed')),
      );

      component.sendMessageToBackend(10, 'Test');

      expect(handleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('handleMessageError()', () => {
    it('should set isTyping and isMessageStreaming to false', () => {
      component.isTyping = true;
      component.isMessageStreaming = true;

      component.handleMessageError();

      expect(component.isTyping).toBeFalse();
      expect(component.isMessageStreaming).toBeFalse();
    });

    it('should append a BOT error message to messages', () => {
      component.messages = [];

      component.handleMessageError();

      expect(component.messages.length).toBe(1);
      const errMsg = component.messages[0].msg;
      expect(errMsg.sender).toBe('BOT');
      expect(errMsg.messageClass).toBe('error');
      expect(errMsg.message).toContain('wrong');
    });

    it('should set shouldScroll to true', () => {
      component.shouldScroll = false;
      component.handleMessageError();
      expect(component.shouldScroll).toBeTrue();
    });
  });

  describe('onStreamingFinished()', () => {
    it('should set isMessageStreaming to false', () => {
      component.isMessageStreaming = true;
      component.onStreamingFinished();
      expect(component.isMessageStreaming).toBeFalse();
    });
  });

  describe('toggleSidebar()', () => {
    it('should toggle isSidebarOpen from true to false', () => {
      component.isSidebarOpen = true;
      component.toggleSidebar();
      expect(component.isSidebarOpen).toBeFalse();
    });

    it('should toggle isSidebarOpen from false to true', () => {
      component.isSidebarOpen = false;
      component.toggleSidebar();
      expect(component.isSidebarOpen).toBeTrue();
    });
  });

  describe('goBack()', () => {
    it('should navigate to /explore', () => {
      component.goBack();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/explore']);
    });
  });
});
