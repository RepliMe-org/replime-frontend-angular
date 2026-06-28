import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ChatSessionService } from './chat-session.service';
import {
  SessionsResponse,
  SessionDetail,
  ChatMessage,
  SendMessageResponse,
} from '../../../core/models/chatbot.model';

describe('ChatSessionService', () => {
  let service: ChatSessionService;
  let httpMock: HttpTestingController;

  const BASE = '/api/v1/sessions';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatSessionService],
    });
    service = TestBed.inject(ChatSessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getSessions()', () => {
    const mockResponse: SessionsResponse = {
      data: [],
      pagination: { nextCursor: '', hasMore: false, limit: 20 },
    };

    it('should GET sessions with chatbotId and default limit', () => {
      service.getSessions('bot-1').subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url === BASE);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('chatbotId')).toBe('bot-1');
      expect(req.request.params.get('limit')).toBe('20');
      req.flush(mockResponse);
    });

    it('should include cursor param when provided', () => {
      service.getSessions('bot-1', 'cursor-xyz').subscribe();

      const req = httpMock.expectOne((r) => r.url === BASE);
      expect(req.request.params.get('cursor')).toBe('cursor-xyz');
      req.flush(mockResponse);
    });

    it('should NOT include cursor param when cursor is undefined', () => {
      service.getSessions('bot-1', undefined).subscribe();

      const req = httpMock.expectOne((r) => r.url === BASE);
      expect(req.request.params.has('cursor')).toBeFalse();
      req.flush(mockResponse);
    });
  });

  describe('createSession()', () => {
    const mockDetail: SessionDetail = {
      sessionId: 42,
      chatbotId: 'bot-1',
      chatbotName: 'Test Bot',
      greetingMessage: 'Hello!',
      startedAt: '2024-01-01T00:00:00Z',
      messageCount: 0,
    };

    it('should POST to /sessions with chatbotId in body', () => {
      service.createSession('bot-1').subscribe((res) => {
        expect(res).toEqual(mockDetail);
      });

      const req = httpMock.expectOne(BASE);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ chatbotId: 'bot-1' });
      req.flush(mockDetail);
    });
  });

  describe('getSessionDetail()', () => {
    it('should GET /sessions/:id', () => {
      service.getSessionDetail(99).subscribe();

      const req = httpMock.expectOne(`${BASE}/99`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('getMessages()', () => {
    it('should GET /sessions/:id/messages', () => {
      const mockMsgs: ChatMessage[] = [];
      service.getMessages(7).subscribe((msgs) => {
        expect(msgs).toEqual(mockMsgs);
      });

      const req = httpMock.expectOne(`${BASE}/7/messages`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMsgs);
    });
  });

  describe('deleteSession()', () => {
    it('should DELETE /sessions/:id', () => {
      service.deleteSession(5).subscribe();

      const req = httpMock.expectOne(`${BASE}/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('sendMessage()', () => {
    const mockSendResponse: SendMessageResponse = {
      sessionId: 10,
      sessionTitle: 'Hello session',
      userMessage: {} as ChatMessage,
      aiResponse: {} as ChatMessage,
      sources: [],
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should POST to /sessions/:id/messages with message as body', () => {
      service.sendMessage(10, 'Hello!').subscribe((res) => {
        expect(res).toEqual(mockSendResponse);
      });

      const req = httpMock.expectOne(`${BASE}/10/messages`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe('Hello!');
      req.flush(mockSendResponse);
    });
  });
});
