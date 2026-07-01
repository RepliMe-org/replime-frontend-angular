import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from './chat-input.component';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChatInputComponent,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('canSend()', () => {
    it('should return false when message is empty', () => {
      component.message = '';
      expect(component.canSend()).toBeFalse();
    });

    it('should return false when message is only whitespace', () => {
      component.message = '   ';
      expect(component.canSend()).toBeFalse();
    });

    it('should return false when component is disabled (even with text)', () => {
      component.message = 'Hello!';
      component.isDisabled = true;
      expect(component.canSend()).toBeFalse();
    });

    it('should return true when message has text and is not disabled', () => {
      component.message = 'Hello!';
      component.isDisabled = false;
      expect(component.canSend()).toBeTrue();
    });
  });

  describe('send()', () => {
    it('should emit the trimmed message text via messageSent', () => {
      const emitSpy = spyOn(component.messageSent, 'emit');
      component.message = '  Hello World  ';

      component.send();

      expect(emitSpy).toHaveBeenCalledWith('Hello World');
    });

    it('should clear the message after sending', () => {
      component.message = 'Hello!';
      component.send();
      expect(component.message).toBe('');
    });

    it('should NOT emit when message is empty', () => {
      const emitSpy = spyOn(component.messageSent, 'emit');
      component.message = '';

      component.send();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should NOT emit when message is only whitespace', () => {
      const emitSpy = spyOn(component.messageSent, 'emit');
      component.message = '   ';

      component.send();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should NOT emit when component is disabled', () => {
      const emitSpy = spyOn(component.messageSent, 'emit');
      component.message = 'Hello!';
      component.isDisabled = true;

      component.send();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should call resetHeight after sending', () => {
      const resetSpy = spyOn(component, 'resetHeight');
      component.message = 'Hello!';

      component.send();

      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('onKeydown()', () => {
    it('should call send() when Enter key is pressed without Shift', () => {
      const sendSpy = spyOn(component, 'send');
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: false,
      });
      spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(sendSpy).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should NOT call send() when Shift+Enter is pressed', () => {
      const sendSpy = spyOn(component, 'send');
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true,
      });

      component.onKeydown(event);

      expect(sendSpy).not.toHaveBeenCalled();
    });

    it('should NOT call send() for other keys', () => {
      const sendSpy = spyOn(component, 'send');
      const event = new KeyboardEvent('keydown', { key: 'a' });

      component.onKeydown(event);

      expect(sendSpy).not.toHaveBeenCalled();
    });
  });

  describe('autoResize()', () => {
    it('should set element height based on scrollHeight (capped at 140px)', () => {
      const mockTextarea = document.createElement('textarea');
      Object.defineProperty(mockTextarea, 'scrollHeight', {
        value: 100,
        configurable: true,
      });

      const event = { target: mockTextarea } as unknown as Event;
      component.autoResize(event);

      expect(mockTextarea.style.height).toBe('100px');
    });

    it('should cap height at 140px when scrollHeight exceeds 140', () => {
      const mockTextarea = document.createElement('textarea');
      Object.defineProperty(mockTextarea, 'scrollHeight', {
        value: 300,
        configurable: true,
      });

      const event = { target: mockTextarea } as unknown as Event;
      component.autoResize(event);

      expect(mockTextarea.style.height).toBe('140px');
    });
  });

  describe('resetHeight()', () => {
    it('should set textarea height to "auto" when textareaRef is defined', () => {
      const mockEl = document.createElement('textarea');
      mockEl.style.height = '100px';
      component.textareaRef = { nativeElement: mockEl } as any;

      component.resetHeight();

      expect(mockEl.style.height).toBe('auto');
    });

    it('should not throw when textareaRef is undefined', () => {
      component.textareaRef = undefined as any;
      expect(() => component.resetHeight()).not.toThrow();
    });
  });
});
