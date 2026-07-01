import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ChatbotClassificationsService } from './chatbot-classifications.service';
import { MessageClass } from '../models/chatbot-category.model';

describe('ChatbotClassificationsService', () => {
  let service: ChatbotClassificationsService;
  let httpMock: HttpTestingController;

  const BASE = '/api/v1/chatbot/categories';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatbotClassificationsService],
    });
    service = TestBed.inject(ChatbotClassificationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getMessageClasses()', () => {
    it('should GET message classes for a category', () => {
      const mockClasses: MessageClass[] = [
        { id: 1, name: 'Complaint' },
        { id: 2, name: 'Praise' },
      ];

      service.getMessageClasses(5).subscribe((classes) => {
        expect(classes).toEqual(mockClasses);
      });

      const req = httpMock.expectOne(`${BASE}/5/message-classes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockClasses);
    });
  });

  describe('createMessageClasses()', () => {
    it('should POST names array to nested category endpoint', () => {
      const names = ['Complaint', 'Praise'];
      const mockResponse: MessageClass[] = [
        { id: 1, name: 'Complaint' },
        { id: 2, name: 'Praise' },
      ];

      service.createMessageClasses(5, names).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE}/5/message-classes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(names);
      req.flush(mockResponse);
    });
  });

  describe('deleteMessageClass()', () => {
    it('should DELETE a specific message class by categoryId and classId', () => {
      service.deleteMessageClass(5, 2).subscribe((res) => {
        expect(res).toBe('Deleted');
      });

      const req = httpMock.expectOne(`${BASE}/5/message-classes/2`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Deleted');
    });
  });
});
