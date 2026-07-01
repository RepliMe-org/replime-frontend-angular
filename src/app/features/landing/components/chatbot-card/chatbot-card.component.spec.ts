import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { ChatbotCardComponent } from './chatbot-card.component';

describe('ChatbotCardComponent', () => {
  let component: ChatbotCardComponent;
  let fixture: ComponentFixture<ChatbotCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotCardComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotCardComponent);
    component = fixture.componentInstance;
    component.chatbot = {
      id: '1',
      influencerUsername: 'test',
      chatbotName: 'test',
      chatbotDescription: 'test',
      categoryName: 'test',
      greetingMessage: 'hello',
      avatarUrl: '',
      channelHandle: '',
      status: 'ACTIVE'
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
