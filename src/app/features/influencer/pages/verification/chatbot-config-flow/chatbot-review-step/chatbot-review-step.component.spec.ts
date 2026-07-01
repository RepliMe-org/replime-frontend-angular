import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ChatbotReviewStepComponent } from './chatbot-review-step.component';

describe('ChatbotReviewStepComponent', () => {
  let component: ChatbotReviewStepComponent;
  let fixture: ComponentFixture<ChatbotReviewStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotReviewStepComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotReviewStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
