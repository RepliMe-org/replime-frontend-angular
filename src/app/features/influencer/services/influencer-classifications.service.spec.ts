import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  InfluencerClassificationsService,
  ClassificationsResponse,
  SaveClassesResponse,
} from './influencer-classifications.service';
import { MessageClass } from '../../../core/models/chatbot-category.model';

describe('InfluencerClassificationsService', () => {
  let service: InfluencerClassificationsService;
  let httpMock: HttpTestingController;

  const baseUrl = '/api/v1/influencer/chatbot/message-classes';

  const mockClasses: MessageClass[] = [
    {
      id: 1,
      name: 'Programming',
    },
    {
      id: 2,
      name: 'Angular',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(InfluencerClassificationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMessageClasses()', () => {
    it('should GET classifications', () => {
      const response: ClassificationsResponse = {
        category: {
          id: 10,
          name: 'Technology',
        },
        pickedClasses: [mockClasses[0]],
        customClasses: [mockClasses[1]],
        availableClasses: mockClasses,
      };

      service.getMessageClasses().subscribe((res) => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(baseUrl);

      expect(req.request.method).toBe('GET');

      req.flush(response);
    });
  });

  describe('addPickedClass()', () => {
    it('should PUT picked class id', () => {
      service.addPickedClass(5).subscribe((res) => {
        expect(res).toEqual(mockClasses);
      });

      const req = httpMock.expectOne(baseUrl);

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual([5]);

      req.flush(mockClasses);
    });
  });

  describe('addCustomClass()', () => {
    it('should POST custom class name', () => {
      const response: SaveClassesResponse = {
        success: true,
        message: 'Saved successfully',
      };

      service.addCustomClass('Machine Learning').subscribe((res) => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(baseUrl);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(['Machine Learning']);

      req.flush(response);
    });
  });

  describe('deleteMessageClass()', () => {
    it('should DELETE a message class', () => {
      const response: SaveClassesResponse = {
        success: true,
        message: 'Deleted successfully',
      };

      service.deleteMessageClass(12).subscribe((res) => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/12`);

      expect(req.request.method).toBe('DELETE');

      req.flush(response);
    });
  });
});
