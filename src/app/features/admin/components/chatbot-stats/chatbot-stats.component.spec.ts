import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotStatsComponent } from './chatbot-stats.component';

describe('ChatbotStatsComponent', () => {
  let component: ChatbotStatsComponent;
  let fixture: ComponentFixture<ChatbotStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
