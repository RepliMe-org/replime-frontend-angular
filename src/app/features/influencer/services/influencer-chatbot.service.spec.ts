import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InfluencerChatbotService, ChatbotConfigResponse } from './influencer-chatbot.service';

describe('InfluencerChatbotService', () => {
  let service: InfluencerChatbotService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InfluencerChatbotService]
    });
    service = TestBed.inject(InfluencerChatbotService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get chatbot config', () => {
    const mockResponse: ChatbotConfigResponse = { configInfo: { configId: 1, avatarUrl: 'test' } };
    
    service.getChatbotConfig().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/v1/influencer/chatbot');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get status', () => {
    service.getStatus().subscribe(res => {
      expect(res).toEqual('OK');
    });

    const req = httpMock.expectOne('/api/v1/influencer/chatbot/status');
    expect(req.request.method).toBe('GET');
    req.flush('OK');
  });

  it('should create config', () => {
    const data = { name: 'Test' };
    
    service.createConfig(data).subscribe(res => {
      expect(res).toBe('Success');
    });

    const req = httpMock.expectOne('/api/v1/influencer/chatbot/config');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush('Success');
  });

  it('should update config', () => {
    const data = { id: 1, name: 'Updated' };
    
    service.updateConfig(data).subscribe(res => {
      expect(res).toEqual(data);
    });

    const req = httpMock.expectOne('/api/v1/influencer/chatbot/config');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(data);
    req.flush(data);
  });

  it('should add system classifications', () => {
    const ids = [1, 2, 3];
    
    service.addSystemClassifications(ids).subscribe(res => {
      expect(res).toBe('Added');
    });

    const req = httpMock.expectOne('/api/v1/influencer/chatbot/message-classes');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(ids);
    req.flush('Added');
  });

  it('should assign chatbot category', () => {
    const data = { active: true };
    const categoryId = 'cat123';
    
    service.assignChatbotCategory(categoryId, data).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`/api/v1/influencer/chatbot/category/${categoryId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(data);
    req.flush({ success: true });
  });

  it('should create custom message class', () => {
    const names = ['Class1', 'Class2'];
    
    service.createCustomMessageClass(names).subscribe(res => {
      expect(res).toBe('Created');
    });

    const req = httpMock.expectOne('/api/v1/influencer/chatbot/message-classes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(names);
    req.flush('Created');
  });
});
