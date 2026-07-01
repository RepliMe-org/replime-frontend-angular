import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { ChatbotStatusBadgeComponent } from './chatbot-status-badge.component';

describe('ChatbotStatusBadgeComponent', () => {
  let component: ChatbotStatusBadgeComponent;
  let fixture: ComponentFixture<ChatbotStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotStatusBadgeComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotStatusBadgeComponent);
    component = fixture.componentInstance;
    component.status = 'ACTIVE';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
