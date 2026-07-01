import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TrainingSourceService } from './training-source.service';
import {
  AddSourcePayload,
  VideoResponseDTO,
} from '../models/training-source.model';

describe('TrainingSourceService', () => {
  let service: TrainingSourceService;
  let httpMock: HttpTestingController;

  const baseUrl = '/api/v1/influencer/chatbot';

  const mockVideos: VideoResponseDTO[] = [
    {
      sourceId: 1,
      videoId: 101,
      youtubeVideoId: 'abc123',
      title: 'Angular Basics',
      thumbnail: 'thumb1.jpg',
      syncStatus: 'COMPLETED',
      duration: '12:30',
      failureReason: null,
    },
    {
      sourceId: 2,
      videoId: 102,
      youtubeVideoId: 'xyz456',
      title: 'RxJS Guide',
      thumbnail: 'thumb2.jpg',
      syncStatus: 'PROCESSING',
      duration: '08:45',
      failureReason: null,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(TrainingSourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addSource()', () => {
    it('should POST a training source', () => {
      const payload: AddSourcePayload = {
        sourceType: 'PLAYLIST',
        sourceValue: 'https://youtube.com/playlist?list=test',
      };

      service.addSource(payload).subscribe((res) => {
        expect(res).toEqual(mockVideos);
      });

      const req = httpMock.expectOne(`${baseUrl}/training-sources`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);

      req.flush(mockVideos);
    });
  });

  describe('deleteVideo()', () => {
    it('should DELETE a video', () => {
      service.deleteVideo('123').subscribe((res) => {
        expect(res).toBe('Deleted');
      });

      const req = httpMock.expectOne(`${baseUrl}/videos/123`);

      expect(req.request.method).toBe('DELETE');
      expect(req.request.responseType).toBe('text');

      req.flush('Deleted');
    });
  });

  describe('getAllVideos()', () => {
    it('should GET all videos', () => {
      service.getAllVideos().subscribe((res) => {
        expect(res).toEqual(mockVideos);
      });

      const req = httpMock.expectOne(`${baseUrl}/videos`);

      expect(req.request.method).toBe('GET');

      req.flush(mockVideos);
    });
  });
});
