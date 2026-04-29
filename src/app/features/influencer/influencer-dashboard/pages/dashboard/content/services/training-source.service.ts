import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  AddSourcePayload,
  VideoResponseDTO,
} from '../models/training-source.model';

@Injectable({ providedIn: 'root' })
export class TrainingSourceService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v1/influencer/chatbot';

  addSource(request: AddSourcePayload): Observable<VideoResponseDTO[]> {
    return this.http.post<VideoResponseDTO[]>(
      `${this.baseUrl}/training-sources`,
      request,
    );
  }

  deleteVideo(videoId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/videos/${videoId}`);
  }

  getAllVideos(): Observable<VideoResponseDTO[]> {
    return this.http.get<VideoResponseDTO[]>(`${this.baseUrl}/videos`);
  }
}
