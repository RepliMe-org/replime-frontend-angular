import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatMessageComponent } from './chat-message.component';
import { ChatMessage } from '../../../../core/models/chatbot.model';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const userMessage: ChatMessage = {
  id: 1,
  message: 'Hello there!',
  sender: 'USER',
  sentAt: '2024-06-01T12:30:00Z',
  messageStatus: 'SENT',
  messageClass: '',
};

const botMessage: ChatMessage = {
  id: 2,
  message: 'Hi! How can I help?',
  sender: 'BOT',
  sentAt: '2024-06-01T12:30:05Z',
  messageStatus: 'SENT',
  messageClass: '',
};

describe('ChatMessageComponent', () => {
  let component: ChatMessageComponent;
  let fixture: ComponentFixture<ChatMessageComponent>;

  function createComponent(message: ChatMessage, isNewMessage = false) {
    component.message = message;
    component.isNewMessage = isNewMessage;
    component.sources = [];
    component.avatarUrl = null;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageComponent, HttpClientTestingModule],
    })
      .overrideComponent(ChatMessageComponent, {
        set: {
          template: `<div></div>`,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChatMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    createComponent(userMessage);
    expect(component).toBeTruthy();
  });

  describe('isUser()', () => {
    it('should return true for USER sender', () => {
      createComponent(userMessage);
      expect(component.isUser()).toBeTrue();
    });

    it('should return false for BOT sender', () => {
      createComponent(botMessage);
      expect(component.isUser()).toBeFalse();
    });
  });

  describe('formattedTime()', () => {
    it('should return a non-empty formatted time string', () => {
      createComponent(userMessage);
      const time = component.formattedTime();
      expect(typeof time).toBe('string');
      expect(time.length).toBeGreaterThan(0);
    });
  });

  describe('ngOnInit() for USER messages', () => {
    it('should set renderedText to full message immediately (no streaming)', () => {
      createComponent(userMessage, false);
      expect(component.renderedText).toBe('Hello there!');
      expect(component.isStreaming).toBeFalse();
    });

    it('should NOT start streaming even if isNewMessage is true for USER sender', () => {
      createComponent(userMessage, true);
      expect(component.isStreaming).toBeFalse();
      expect(component.renderedText).toBe('Hello there!');
    });
  });

  describe('ngOnInit() for old BOT messages', () => {
    it('should set renderedText to full message without streaming', () => {
      createComponent(botMessage, false);
      expect(component.renderedText).toBe('Hi! How can I help?');
      expect(component.isStreaming).toBeFalse();
    });
  });

  describe('ngOnInit() for new BOT messages (streaming)', () => {
    it('should start streaming and set isStreaming to true', fakeAsync(() => {
      createComponent(botMessage, true);
      expect(component.isStreaming).toBeTrue();
      tick(5000);
      expect(component.isStreaming).toBeFalse();
    }));

    it('should accumulate renderedText from tokens during streaming', fakeAsync(() => {
      createComponent(botMessage, true);
      tick(5000);
      expect(component.renderedText).toBe('Hi! How can I help?');
    }));

    it('should emit streamingFinished when streaming completes', fakeAsync(() => {
      const emitSpy = spyOn(component.streamingFinished, 'emit');
      createComponent(botMessage, true);
      tick(5000);
      expect(emitSpy).toHaveBeenCalled();
    }));
  });

  describe('host binding', () => {
    it('should bind id attribute as msg-{message.id}', () => {
      createComponent(userMessage);
      const el: HTMLElement = fixture.nativeElement;
      expect(el.getAttribute('id')).toBe('msg-1');
    });
  });
});
