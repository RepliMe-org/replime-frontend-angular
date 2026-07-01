import { TestBed } from '@angular/core/testing';
import { WebSocketClient } from './websocket.client';
import { AuthService } from '../services/auth.service';

describe('WebSocketClient', () => {
  let service: WebSocketClient;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        WebSocketClient,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    service = TestBed.inject(WebSocketClient);
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reuse the same subject for a topic', () => {
    service.on('/topic/test');
    service.on('/topic/test');

    expect((service as any).subjects.size).toBe(1);
    expect((service as any).subjects.has('/topic/test')).toBeTrue();
  });

  it('should clean up topic on unsubscribeTopic', () => {
    const obs = service.on('/topic/test');
    expect((service as any).subjects.has('/topic/test')).toBeTrue();

    service.unsubscribeTopic('/topic/test');
    expect((service as any).subjects.has('/topic/test')).toBeFalse();
  });

  it('should clean up all topics on disconnect', () => {
    service.on('/topic/test1');
    service.on('/topic/test2');

    expect((service as any).subjects.size).toBe(2);

    service.disconnect();

    expect((service as any).subjects.size).toBe(0);
  });

  it('should clean up on ngOnDestroy', () => {
    service.on('/topic/test1');
    service.ngOnDestroy();
    expect((service as any).subjects.size).toBe(0);
  });

  it('should call activate when connect is called', () => {
    service.connect();
    expect((service as any).client).toBeTruthy();
    expect((service as any).client.active).toBeTrue();

    // Calling connect again should not create a new client
    const existingClient = (service as any).client;
    service.connect();
    expect((service as any).client).toBe(existingClient);
  });
});
