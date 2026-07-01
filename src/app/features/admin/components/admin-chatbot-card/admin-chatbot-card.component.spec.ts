import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminChatbotCardComponent } from './admin-chatbot-card.component';

describe('AdminChatbotCardComponent', () => {
  let component: AdminChatbotCardComponent;
  let fixture: ComponentFixture<AdminChatbotCardComponent>;

  const mockBot = {
    id: '1',
    influencerUsername: 'test-user',
    chatbotName: 'Test Bot',
    chatbotDescription: 'Test Description',
    categoryName: 'Education',
    greetingMessage: 'Hello!',
    avatarUrl: '',
    channelHandle: '@test',
    status: 'ACTIVE',
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminChatbotCardComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminChatbotCardComponent);
    component = fixture.componentInstance;
    component.bot = mockBot;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should receive bot input', () => {
      expect(component.bot).toEqual(mockBot);
    });
  });

  describe('onToggleVisibility', () => {
    it('should emit the current bot', () => {
      spyOn(component.visibilityToggle, 'emit');

      component.onToggleVisibility();

      expect(component.visibilityToggle.emit).toHaveBeenCalledOnceWith(mockBot);
    });

    it('should emit exactly once', () => {
      spyOn(component.visibilityToggle, 'emit');

      component.onToggleVisibility();

      expect(component.visibilityToggle.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit updated bot when input changes', () => {
      spyOn(component.visibilityToggle, 'emit');

      const updatedBot = {
        ...mockBot,
        chatbotName: 'Updated Bot',
      };

      component.bot = updatedBot;

      component.onToggleVisibility();

      expect(component.visibilityToggle.emit).toHaveBeenCalledWith(updatedBot);
    });
  });
});
