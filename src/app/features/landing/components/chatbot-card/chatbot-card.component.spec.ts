import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotCardComponent } from './chatbot-card.component';

describe('ChatbotCardComponent', () => {
  let component: ChatbotCardComponent;
  let fixture: ComponentFixture<ChatbotCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
