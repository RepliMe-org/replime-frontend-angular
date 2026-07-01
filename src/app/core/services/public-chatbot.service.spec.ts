import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PublicChatbotService } from './public-chatbot.service';

describe('PublicChatbotService', () => {
  let service: PublicChatbotService;
  let httpMock: HttpTestingController;

  const BASE = '/api/v1/chatbots';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PublicChatbotService],
    });
    service = TestBed.inject(PublicChatbotService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getAllChatbots()', () => {
    it('should GET all chatbots from base URL', () => {
      const mockChatbots = [{ id: 'c1', name: 'Bot One' }];

      service.getAllChatbots().subscribe((res) => {
        expect(res).toEqual(mockChatbots as any);
      });

      const req = httpMock.expectOne(BASE);
      expect(req.request.method).toBe('GET');
      req.flush(mockChatbots);
    });
  });

  describe('getChatbotById()', () => {
    it('should GET a single chatbot by id', () => {
      const mockChatbot = { id: 'c1', name: 'Bot One' };

      service.getChatbotById('c1').subscribe((res) => {
        expect(res).toEqual(mockChatbot);
      });

      const req = httpMock.expectOne(`${BASE}/c1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockChatbot);
    });
  });
});
