import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { SyncStatusWsService } from './sync-status-ws.service';
import { WebSocketClient } from '../websocket.client';
import { WsSyncMessage } from '../websocket.model';

describe('SyncStatusWsService', () => {
  let service: SyncStatusWsService;
  let mockWsClient: jasmine.SpyObj<WebSocketClient>;

  beforeEach(() => {
    mockWsClient = jasmine.createSpyObj('WebSocketClient', ['connect', 'on', 'unsubscribeTopic']);
    
    TestBed.configureTestingModule({
      providers: [
        SyncStatusWsService,
        { provide: WebSocketClient, useValue: mockWsClient }
      ]
    });
    service = TestBed.inject(SyncStatusWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should connect to websocket with correct topic', () => {
    const wsSubject = new Subject<WsSyncMessage>();
    mockWsClient.on.and.returnValue(wsSubject.asObservable());

    const result = service.connect('123');

    expect(service.topic).toBe('/topic/chatbot/123/sync-status');
    expect(mockWsClient.connect).toHaveBeenCalled();
    expect(mockWsClient.on).toHaveBeenCalledWith('/topic/chatbot/123/sync-status');
    
    let receivedMsg: WsSyncMessage | undefined;
    result.subscribe(msg => receivedMsg = msg);
    
    const testMsg: WsSyncMessage = { sourceId: 1, type: 'VIDEO_UPDATE', videoId: 1, status: 'COMPLETED' };
    wsSubject.next(testMsg);
    
    expect(receivedMsg).toEqual(testMsg);
  });

  it('should disconnect from websocket', () => {
    service.topic = '/topic/test';
    service.disconnect();

    expect(mockWsClient.unsubscribeTopic).toHaveBeenCalledWith('/topic/test');
    expect(service.topic).toBeNull();
  });

  it('should not disconnect if topic is null', () => {
    service.topic = null;
    service.disconnect();

    expect(mockWsClient.unsubscribeTopic).not.toHaveBeenCalled();
  });
});
