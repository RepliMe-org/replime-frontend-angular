import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VerificationConfirmResponse, VerificationRequestPayload, VerificationRequestResponse } from '../verification/models/verification.model';


@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private readonly baseUrl = '/api/v1/influencer/verify';

  constructor(private http: HttpClient) {}

  requestVerification(channelUrl: string): Observable<VerificationRequestResponse> {
    const payload: VerificationRequestPayload = { channelUrl };
    return this.http.post<VerificationRequestResponse>(
      `${this.baseUrl}/request`,
      payload
    );
  }

  confirmVerification(): Observable<VerificationConfirmResponse> {
    return this.http.post<VerificationConfirmResponse>(
      `${this.baseUrl}/confirm`,
      {}
    );
  }
}