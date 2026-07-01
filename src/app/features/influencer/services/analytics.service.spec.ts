import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { AnalyticsService } from './analytics.service';
import {
  AnalyticsReportResponseDTO,
  ContentGapResponseDTO,
} from '../models/analytics.model';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let httpMock: HttpTestingController;

  const baseUrl = '/api/v1/influencer/chatbot/analytics';

  const mockReport: AnalyticsReportResponseDTO = {
    id: 1,
    generatedAt: '2024-01-01T12:00:00Z',
    generatedAtHistory: ['2024-01-01T12:00:00Z', '2023-12-31T12:00:00Z'],
    contentGapCountHistory: [5, 3],
    classificationBreakdown: [
      {
        messageClass: 'Programming',
        count: 20,
        percentage: 50,
      },
      {
        messageClass: 'Angular',
        count: 20,
        percentage: 50,
      },
    ],
    mostAskedClusters: [
      {
        theme: 'Angular Routing',
        count: 10,
        exampleQuestions: ['How do routes work?', 'What is lazy loading?'],
      },
    ],
    executiveSummary: 'Everything looks good.',
    mostCitedVideos: [
      {
        videoId: 'abc123',
        title: 'Angular Basics',
        count: 12,
      },
    ],
  };

  const mockContentGaps: ContentGapResponseDTO = {
    generatedAt: '2024-01-01T12:00:00Z',
    contentGaps: [
      {
        topic: 'RxJS',
        frequency: 10,
        sampleQuestions: ['How does switchMap work?'],
        summary: 'Users frequently ask about RxJS.',
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AnalyticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLatestReport()', () => {
    it('should GET the latest report', () => {
      service.getLatestReport().subscribe((res) => {
        expect(res).toEqual(mockReport);
      });

      const req = httpMock.expectOne(`${baseUrl}/latest`);

      expect(req.request.method).toBe('GET');

      req.flush(mockReport);
    });
  });

  describe('getReportByTimestamp()', () => {
    it('should GET report by generatedAt', () => {
      const generatedAt = '2024-01-01T12:00:00Z';

      service.getReportByTimestamp(generatedAt).subscribe((res) => {
        expect(res).toEqual(mockReport);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === `${baseUrl}/report` &&
          request.params.get('generatedAt') === generatedAt,
      );

      expect(req.request.method).toBe('GET');

      req.flush(mockReport);
    });
  });

  describe('regenerateReport()', () => {
    it('should POST and return the regenerated report', () => {
      service.regenerateReport().subscribe((res) => {
        expect(res).toEqual(mockReport);
      });

      const req = httpMock.expectOne(baseUrl);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush(mockReport);
    });

    it('should propagate HttpErrorResponse', () => {
      let actualError: HttpErrorResponse | undefined;

      service.regenerateReport().subscribe({
        next: fail,
        error: (err) => {
          actualError = err;
        },
      });

      const req = httpMock.expectOne(baseUrl);

      req.flush(
        { error: 'Cooldown active' },
        {
          status: 429,
          statusText: 'Too Many Requests',
        },
      );

      expect(actualError).toBeTruthy();
      expect(actualError instanceof HttpErrorResponse).toBeTrue();
      expect(actualError?.status).toBe(429);
    });
  });

  describe('getContentGaps()', () => {
    it('should GET content gaps by generatedAt', () => {
      const generatedAt = '2024-01-01T12:00:00Z';

      service.getContentGaps(generatedAt).subscribe((res) => {
        expect(res).toEqual(mockContentGaps);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === `${baseUrl}/content-gaps` &&
          request.params.get('generatedAt') === generatedAt,
      );

      expect(req.request.method).toBe('GET');

      req.flush(mockContentGaps);
    });
  });
});
