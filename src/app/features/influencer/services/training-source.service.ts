import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AddSourcePayload,
  VideoResponseDTO,
} from '../models/training-source.model';

@Injectable({ providedIn: 'root' })
export class TrainingSourceService {
  private baseUrl = '/api/v1/influencer/chatbot';
  constructor(private http: HttpClient) {}

  addSource(request: AddSourcePayload): Observable<VideoResponseDTO[]> {
    return this.http.post<VideoResponseDTO[]>(
      `${this.baseUrl}/training-sources`,
      request,
    );
  }

  deleteVideo(videoId: string) {
    return this.http.delete(`${this.baseUrl}/videos/${videoId}`, {
      responseType: 'text',
    });
  }

  getAllVideos(): Observable<VideoResponseDTO[]> {
    return this.http.get<VideoResponseDTO[]>(`${this.baseUrl}/videos`);
  }
}
