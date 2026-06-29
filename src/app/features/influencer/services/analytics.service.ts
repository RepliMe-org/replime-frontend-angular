import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AnalyticsCooldownError,
  AnalyticsReportResponseDTO,
  ContentGapResponseDTO,
} from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private baseUrl = '/api/v1/influencer/chatbot/analytics';

  constructor(private http: HttpClient) {}

  getLatestReport(): Observable<AnalyticsReportResponseDTO> {
    return this.http.get<AnalyticsReportResponseDTO>(`${this.baseUrl}/latest`);
  }

  getReportByTimestamp(
    generatedAt: string,
  ): Observable<AnalyticsReportResponseDTO> {
    return this.http.get<AnalyticsReportResponseDTO>(`${this.baseUrl}/report`, {
      params: { generatedAt },
    });
  }

  regenerateReport(): Observable<AnalyticsReportResponseDTO> {
    return this.http.post<AnalyticsReportResponseDTO>(this.baseUrl, {}).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      }),
    );
  }

  getContentGaps(generatedAt: string): Observable<ContentGapResponseDTO> {
    return this.http.get<ContentGapResponseDTO>(
      `${this.baseUrl}/content-gaps`,
      {
        params: { generatedAt },
      },
    );
  }
}
