import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotStatusBadgeComponent } from './chatbot-status-badge.component';

describe('ChatbotStatusBadgeComponent', () => {
  let component: ChatbotStatusBadgeComponent;
  let fixture: ComponentFixture<ChatbotStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotStatusBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
