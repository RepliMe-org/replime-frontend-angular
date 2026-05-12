import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotFiltersComponent } from './chatbot-filters.component';

describe('ChatbotFiltersComponent', () => {
  let component: ChatbotFiltersComponent;
  let fixture: ComponentFixture<ChatbotFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
