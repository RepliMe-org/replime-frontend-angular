import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageClass } from '../../../core/models/chatbot-category.model';

export interface ClassificationsResponse {
  category: MessageClass;

  pickedClasses: MessageClass[];
  customClasses: MessageClass[];
  availableClasses: MessageClass[];
}

export interface SaveClassesResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class InfluencerClassificationsService {
  private baseUrl = '/api/v1/influencer/chatbot/message-classes';

  constructor(private http: HttpClient) {}
  
  getMessageClasses(): Observable<ClassificationsResponse> {
    return this.http.get<ClassificationsResponse>(this.baseUrl);
  }

  addPickedClass(classId: number): Observable<MessageClass[]> {
    return this.http.put<MessageClass[]>(this.baseUrl, [classId]);
  }

  addCustomClass(name: string): Observable<SaveClassesResponse> {
    return this.http.post<SaveClassesResponse>(this.baseUrl, [name]);
  }

  deleteMessageClass(messageClassId: number): Observable<SaveClassesResponse> {
    return this.http.delete<SaveClassesResponse>(
      `${this.baseUrl}/${messageClassId}`,
    );
  }
}
