import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ChatbotCategoryService } from './chatbot-category.service';
import { ChatbotCategory } from '../models/chatbot-category.model';

describe('ChatbotCategoryService', () => {
  let service: ChatbotCategoryService;
  let httpMock: HttpTestingController;

  const BASE = '/api/v1/chatbot/categories';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatbotCategoryService],
    });
    service = TestBed.inject(ChatbotCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getCategories()', () => {
    it('should GET all categories from base URL', () => {
      const mockCategories: ChatbotCategory[] = [
        { id: 1, name: 'Sports' },
        { id: 2, name: 'Tech' },
      ] as ChatbotCategory[];

      service.getCategories().subscribe((cats) => {
        expect(cats).toEqual(mockCategories);
      });

      const req = httpMock.expectOne(BASE);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });

  describe('createCategories()', () => {
    it('should POST array of names and return text response', () => {
      const names = ['Music', 'Gaming'];
      service.createCategories(names).subscribe((res) => {
        expect(res).toBe('Created successfully');
      });

      const req = httpMock.expectOne(BASE);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(names);
      req.flush('Created successfully');
    });
  });

  describe('deleteCategory()', () => {
    it('should DELETE category by id', () => {
      service.deleteCategory(3).subscribe((res) => {
        expect(res).toBe('Deleted');
      });

      const req = httpMock.expectOne(`${BASE}/3`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Deleted');
    });
  });
});
