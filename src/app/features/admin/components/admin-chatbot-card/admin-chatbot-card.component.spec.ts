import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChatbotCardComponent } from './admin-chatbot-card.component';

describe('AdminChatbotCardComponent', () => {
  let component: AdminChatbotCardComponent;
  let fixture: ComponentFixture<AdminChatbotCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChatbotCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChatbotCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
