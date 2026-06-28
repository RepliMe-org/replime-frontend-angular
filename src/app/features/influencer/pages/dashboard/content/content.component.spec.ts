import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { ContentComponent } from './content.component';
import { TrainingSourceService } from '../../../services/training-source.service';
import { InfluencerChatbotService } from '../../../services/influencer-chatbot.service';
import { SyncStatusWsService } from '../../../../../core/websocket/domains/sync-status-ws.service';
import { WebSocketClient } from '../../../../../core/websocket/websocket.client';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  VideoResponseDTO,
  AddSourcePayload,
} from '../../../models/training-source.model';
import { WsSyncMessage } from '../../../../../core/websocket/websocket.model';

describe('ContentComponent Integration', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  let httpMock: HttpTestingController;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockWsClient: jasmine.SpyObj<WebSocketClient>;
  let wsSubject: Subject<WsSyncMessage>;

  const mockVideos: VideoResponseDTO[] = [
    {
      videoId: 1,
      sourceId: 1,
      youtubeVideoId: '1',
      title: 'Test Video 1',
      thumbnail: 'thumb1.jpg',
      syncStatus: 'COMPLETED',
      duration: '120',
    },
    {
      videoId: 2,
      sourceId: 2,
      youtubeVideoId: '2',
      title: 'Test Video 2',
      thumbnail: 'thumb2.jpg',
      syncStatus: 'PROCESSING',
      duration: '60',
    },
  ];

  beforeEach(async () => {
    mockToastService = jasmine.createSpyObj('ToastService', [
      'success',
      'error',
    ]);
    mockWsClient = jasmine.createSpyObj('WebSocketClient', [
      'connect',
      'on',
      'unsubscribeTopic',
      'disconnect',
    ]);
    wsSubject = new Subject<WsSyncMessage>();
    mockWsClient.on.and.returnValue(wsSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        ContentComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        TrainingSourceService,
        InfluencerChatbotService,
        SyncStatusWsService,
        { provide: WebSocketClient, useValue: mockWsClient },
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    component.gridApi = jasmine.createSpyObj('GridApi', ['getRowNode']);
    const mockRowNode = jasmine.createSpyObj('RowNode', ['setData']);
    (component.gridApi.getRowNode as jasmine.Spy).and.returnValue(mockRowNode);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize and connect to WS and fetch videos if chatbotId exists', () => {
    fixture.detectChanges();

    const reqConfig = httpMock.expectOne('/api/v1/influencer/chatbot');
    expect(reqConfig.request.method).toBe('GET');
    reqConfig.flush({ chatbotInfo: { id: '123' } });

    expect(mockWsClient.connect).toHaveBeenCalled();
    expect(mockWsClient.on).toHaveBeenCalledWith(
      '/topic/chatbot/123/sync-status',
    );

    const reqVideos = httpMock.expectOne('/api/v1/influencer/chatbot/videos');
    expect(reqVideos.request.method).toBe('GET');
    reqVideos.flush(mockVideos);

    expect(component.rowData).toEqual(mockVideos);
  });

  it('should not connect to WS if chatbotId does not exist but still fetch videos', () => {
    fixture.detectChanges();

    const reqConfig = httpMock.expectOne('/api/v1/influencer/chatbot');
    reqConfig.flush({});

    expect(mockWsClient.connect).not.toHaveBeenCalled();

    const reqVideos = httpMock.expectOne('/api/v1/influencer/chatbot/videos');
    reqVideos.flush(mockVideos);

    expect(component.rowData).toEqual(mockVideos);
  });

  it('should update row status on WS message', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    const msg: WsSyncMessage = {
      sourceId: 2,
      type: 'VIDEO_UPDATE',
      videoId: 2,
      status: 'FAILED',
      errorMessage: 'Timeout',
    };
    wsSubject.next(msg);

    expect(component.rowData[1].syncStatus).toBe('FAILED');
    expect(component.rowData[1].failureReason).toBe('Timeout');
    expect(component.gridApi.getRowNode).toHaveBeenCalledWith('1');
  });

  it('should update row status without failure reason on WS message if missing', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    const msg: WsSyncMessage = {
      sourceId: 2,
      type: 'VIDEO_UPDATE',
      videoId: 2,
      status: 'COMPLETED',
    };
    wsSubject.next(msg);

    expect(component.rowData[1].syncStatus).toBe('COMPLETED');
    expect(component.rowData[1].failureReason).toBeNull();
  });

  it('should not update row status if videoId is not found', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    const msg: WsSyncMessage = {
      sourceId: 99,
      type: 'VIDEO_UPDATE',
      videoId: 99,
      status: 'COMPLETED',
    };
    wsSubject.next(msg);

    expect(component.gridApi.getRowNode).not.toHaveBeenCalled();
  });

  it('should open modal with specific mode', () => {
    component.openModal('VIDEO');
    expect(component.modalMode).toBe('VIDEO');
    expect(component.showModal).toBeTrue();
  });

  it('should set gridApi on grid ready', () => {
    const api = {} as any;
    component.onGridReady(api);
    expect(component.gridApi).toBe(api);
  });

  it('should disconnect WS on destroy', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    component.ngOnDestroy();
    expect(mockWsClient.unsubscribeTopic).toHaveBeenCalledWith(
      '/topic/chatbot/123/sync-status',
    );
  });

  it('should disconnect WS on destroy even if topic is null', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1/influencer/chatbot').flush({});
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    component.ngOnDestroy();
    expect(mockWsClient.unsubscribeTopic).not.toHaveBeenCalled();
  });

  it('should delete video, show success, and refresh list', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    component.deleteVideo('2');

    const reqDelete = httpMock.expectOne('/api/v1/influencer/chatbot/videos/2');
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush('OK', { status: 200, statusText: 'OK' });

    expect(mockToastService.success).toHaveBeenCalledWith(
      'Video removed successfully.',
    );

    const reqRefresh = httpMock.expectOne('/api/v1/influencer/chatbot/videos');
    reqRefresh.flush(mockVideos);
  });

  it('should show error if delete fails', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    component.deleteVideo('2');

    const reqDelete = httpMock.expectOne('/api/v1/influencer/chatbot/videos/2');
    reqDelete.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(mockToastService.error).toHaveBeenCalledWith(
      'Failed to delete video. Please try again.',
    );

    const reqRefresh = httpMock.expectOne('/api/v1/influencer/chatbot/videos');
    reqRefresh.flush(mockVideos);
  });

  it('should add source, show success, hide modal, and refresh', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    const payload: AddSourcePayload = {
      sourceType: 'VIDEO',
      sourceValue: 'test',
    };
    component.showModal = true;
    component.onSubmit(payload);

    expect(component.isSubmitting).toBeTrue();

    const reqAdd = httpMock.expectOne(
      '/api/v1/influencer/chatbot/training-sources',
    );
    expect(reqAdd.request.method).toBe('POST');
    expect(reqAdd.request.body).toEqual(payload);
    reqAdd.flush(mockVideos);

    expect(component.isSubmitting).toBeFalse();
    expect(mockToastService.success).toHaveBeenCalledWith(
      'Source added successfully.',
    );
    expect(component.showModal).toBeFalse();

    const reqRefresh = httpMock.expectOne('/api/v1/influencer/chatbot/videos');
    reqRefresh.flush(mockVideos);
  });

  it('should show error if add source fails with message', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    const payload: AddSourcePayload = {
      sourceType: 'VIDEO',
      sourceValue: 'test_url',
    };
    component.showModal = true;
    component.onSubmit(payload);

    const reqAdd = httpMock.expectOne(
      '/api/v1/influencer/chatbot/training-sources',
    );
    reqAdd.flush(
      { message: 'Upload failed' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(component.isSubmitting).toBeFalse();
    expect(mockToastService.error).toHaveBeenCalledWith('Upload failed');
    expect(component.showModal).toBeTrue();
  });

  it('should show default error if add source fails without message', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('/api/v1/influencer/chatbot')
      .flush({ chatbotInfo: { id: '123' } });
    httpMock.expectOne('/api/v1/influencer/chatbot/videos').flush(mockVideos);

    const payload: AddSourcePayload = {
      sourceType: 'VIDEO',
      sourceValue: 'test_url',
    };
    component.onSubmit(payload);

    const reqAdd = httpMock.expectOne(
      '/api/v1/influencer/chatbot/training-sources',
    );
    reqAdd.flush(null, { status: 500, statusText: 'Server Error' });

    expect(component.isSubmitting).toBeFalse();
    expect(mockToastService.error).toHaveBeenCalledWith(
      'Failed to add source. Please try again.',
    );
  });
});
