import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BotSettingsComponent } from './bot-settings.component';
import { InfluencerChatbotService } from '../../../services/influencer-chatbot.service';
import { ToastService } from '../../../../../core/services/toast.service';

const mockConfigResponse = {
  configInfo: {
    configId: 1,
    avatarUrl: 'https://img.example.com/avatar.png',
    fetchChannel: true,
    chatbotName: 'MyBot',
    chatbotDescription: 'A helpful bot',
    greetingMessage: 'Hello!',
    talkLikeMe: true,
    tone: 'CASUAL',
    verbosity: 'CONCISE',
    formality: 'FORMAL',
  },
};

describe('BotSettingsComponent', () => {
  let component: BotSettingsComponent;
  let fixture: ComponentFixture<BotSettingsComponent>;
  let mockChatbotService: jasmine.SpyObj<InfluencerChatbotService>;
  let mockToast: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockChatbotService = jasmine.createSpyObj('InfluencerChatbotService', [
      'getChatbotConfig',
      'updateConfig',
    ]);
    mockToast = jasmine.createSpyObj('ToastService', ['success', 'error']);

    mockChatbotService.getChatbotConfig.and.returnValue(of(mockConfigResponse));
    mockChatbotService.updateConfig.and.returnValue(of(mockConfigResponse));

    await TestBed.configureTestingModule({
      imports: [
        BotSettingsComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: InfluencerChatbotService, useValue: mockChatbotService },
        { provide: ToastService, useValue: mockToast },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BotSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadConfig()', () => {
    it('should populate the form from getChatbotConfig on success', () => {
      expect(mockChatbotService.getChatbotConfig).toHaveBeenCalled();
      expect(component.settingsForm.get('name')?.value).toBe('MyBot');
      expect(component.settingsForm.get('description')?.value).toBe('A helpful bot');
      expect(component.settingsForm.get('greetingMessage')?.value).toBe('Hello!');
      expect(component.settingsForm.get('talkLikeMe')?.value).toBeTrue();
      expect(component.isLoading).toBeFalse();
    });

    it('should set avatarUrl and fetchChannel from config', () => {
      expect(component.avatarUrl).toBe('https://img.example.com/avatar.png');
      expect(component.fetchChannel).toBeTrue();
    });

    it('should set loadError to true and call toast.error on failure', () => {
      mockChatbotService.getChatbotConfig.and.returnValue(throwError(() => new Error('fail')));
      component.loadConfig();
      expect(component.loadError).toBeTrue();
      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to load your chatbot settings. Please refresh.'
      );
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('applyConfig()', () => {
    it('should map configInfo fields correctly to form controls', () => {
      component.applyConfig(mockConfigResponse);
      expect(component.settingsForm.get('tone')?.value).toBe('casual');
      expect(component.settingsForm.get('verbosity')?.value).toBe('concise');
      expect(component.settingsForm.get('formality')?.value).toBe('formal');
    });

    it('should fall back to direct response keys when configInfo is absent', () => {
      component.applyConfig({
        name: 'DirectBot',
        description: 'Direct',
        greetingMessage: 'Hi',
        talkLikeMe: false,
        tone: 'FRIENDLY',
        verbosity: 'BALANCED',
        formality: 'NEUTRAL',
      });
      expect(component.settingsForm.get('name')?.value).toBe('DirectBot');
    });

    it('should store initialFormValue and mark form as pristine', () => {
      component.applyConfig(mockConfigResponse);
      expect(component.initialFormValue).toBeTruthy();
      expect(component.settingsForm.pristine).toBeTrue();
    });
  });

  describe('toLower()', () => {
    it('should lowercase a non-empty string', () => {
      expect(component.toLower('FRIENDLY', 'default')).toBe('friendly');
    });

    it('should return fallback for empty string', () => {
      expect(component.toLower('', 'default')).toBe('default');
    });

    it('should return fallback for non-string value', () => {
      expect(component.toLower(null, 'default')).toBe('default');
      expect(component.toLower(undefined, 'default')).toBe('default');
    });
  });

  describe('talkLikeMe()', () => {
    it('should return the current value of the talkLikeMe form control', () => {
      component.settingsForm.patchValue({ talkLikeMe: true });
      expect(component.talkLikeMe()).toBeTrue();
      component.settingsForm.patchValue({ talkLikeMe: false });
      expect(component.talkLikeMe()).toBeFalse();
    });
  });

  describe('toggleTalkLikeMe()', () => {
    it('should flip talkLikeMe from false to true', () => {
      component.settingsForm.patchValue({ talkLikeMe: false });
      component.toggleTalkLikeMe();
      expect(component.talkLikeMe()).toBeTrue();
    });

    it('should flip talkLikeMe from true to false', () => {
      component.settingsForm.patchValue({ talkLikeMe: true });
      component.toggleTalkLikeMe();
      expect(component.talkLikeMe()).toBeFalse();
    });
  });

  describe('syncToneFieldsDisabled()', () => {
    it('should disable tone and formality when talkLikeMe is true', () => {
      component.syncToneFieldsDisabled(true);
      expect(component.settingsForm.get('tone')?.disabled).toBeTrue();
      expect(component.settingsForm.get('formality')?.disabled).toBeTrue();
    });

    it('should enable tone and formality when talkLikeMe is false', () => {
      component.syncToneFieldsDisabled(true);
      component.syncToneFieldsDisabled(false);
      expect(component.settingsForm.get('tone')?.disabled).toBeFalse();
      expect(component.settingsForm.get('formality')?.disabled).toBeFalse();
    });
  });

  describe('isFormValid()', () => {
    it('should return true when form is valid', () => {
      component.settingsForm.patchValue({
        name: 'Bot',
        description: 'Desc',
        greetingMessage: 'Hi',
      });
      expect(component.isFormValid()).toBeTrue();
    });

    it('should return false when required fields are empty', () => {
      component.settingsForm.patchValue({ name: '', description: '', greetingMessage: '' });
      expect(component.isFormValid()).toBeFalse();
    });
  });

  describe('onSave()', () => {
    it('should call updateConfig with correctly-uppercased payload on valid form', () => {
      component.settingsForm.patchValue({
        name: 'Bot',
        description: 'Desc',
        greetingMessage: 'Hello',
        talkLikeMe: false,
        tone: 'friendly',
        verbosity: 'balanced',
        formality: 'neutral',
      });
      component.onSave();
      expect(mockChatbotService.updateConfig).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'Bot',
        tone: 'FRIENDLY',
        verbosity: 'BALANCED',
        formality: 'NEUTRAL',
      }));
    });

    it('should show success toast and call applyConfig on success', () => {
      component.settingsForm.patchValue({ name: 'Bot', description: 'D', greetingMessage: 'Hi' });
      component.onSave();
      expect(mockToast.success).toHaveBeenCalledWith('Chatbot settings updated successfully.');
      expect(component.isSaving).toBeFalse();
    });

    it('should show error toast on updateConfig failure', () => {
      mockChatbotService.updateConfig.and.returnValue(
        throwError(() => ({ error: { message: 'Update failed' } }))
      );
      component.settingsForm.patchValue({ name: 'Bot', description: 'D', greetingMessage: 'Hi' });
      component.onSave();
      expect(mockToast.error).toHaveBeenCalledWith('Update failed');
      expect(component.isSaving).toBeFalse();
    });

    it('should use fallback error message when error has no message', () => {
      mockChatbotService.updateConfig.and.returnValue(throwError(() => ({})));
      component.settingsForm.patchValue({ name: 'Bot', description: 'D', greetingMessage: 'Hi' });
      component.onSave();
      expect(mockToast.error).toHaveBeenCalledWith('Failed to update settings. Please try again.');
    });

    it('should NOT call updateConfig when form is invalid', () => {
      component.settingsForm.patchValue({ name: '', description: '', greetingMessage: '' });
      mockChatbotService.updateConfig.calls.reset();
      component.onSave();
      expect(mockChatbotService.updateConfig).not.toHaveBeenCalled();
    });

    it('should NOT call updateConfig when isSaving is true', () => {
      component.isSaving = true;
      mockChatbotService.updateConfig.calls.reset();
      component.onSave();
      expect(mockChatbotService.updateConfig).not.toHaveBeenCalled();
    });
  });

  describe('hasChanges()', () => {
    it('should return false immediately after loading (initialFormValue matches current)', () => {
      expect(component.hasChanges()).toBeFalse();
    });

    it('should return true after a form value is changed', () => {
      component.settingsForm.patchValue({ name: 'Different Name' });
      expect(component.hasChanges()).toBeTrue();
    });
  });
});
