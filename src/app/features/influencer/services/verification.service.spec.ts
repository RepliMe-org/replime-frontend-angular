import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { VerificationService } from './verification.service';
import {
  VerificationConfirmResponse,
  VerificationRequestResponse,
} from '../models/verification/verification.model';

describe('VerificationService', () => {
  let service: VerificationService;
  let httpMock: HttpTestingController;

  const baseUrl = '/api/v1/influencer/verify';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(VerificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('requestVerification()', () => {
    it('should POST the channel URL', () => {
      const channelUrl = 'https://www.youtube.com/@Angular';

      const response: VerificationRequestResponse = {
        expirationDateAt: '2026-07-01T12:00:00Z',
        message: null,
        verificationToken: 'verify-token-123',
      };

      service.requestVerification(channelUrl).subscribe((res) => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/request`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        channelUrl,
      });

      req.flush(response);
    });
  });

  describe('confirmVerification()', () => {
    it('should POST an empty body', () => {
      const response: VerificationConfirmResponse = {
        expirationDateAt: '2026-07-01T12:00:00Z',
        message: 'Verification successful',
        verificationToken: 'verify-token-123',
      };

      service.confirmVerification().subscribe((res) => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/confirm`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush(response);
    });
  });
});
