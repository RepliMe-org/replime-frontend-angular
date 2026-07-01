import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { VerificationContainerComponent } from './verification-container.component';
import { VerificationService } from '../../../services/verification.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { InfluencerChatbotService, ChatbotConfigResponse } from '../../../services/influencer-chatbot.service';
import { ChatbotCategoryService } from '../../../../../core/services/chatbot-category.service';
import { ChatbotClassificationsService } from '../../../../../core/services/chatbot-classifications.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { VerificationRequestResponse } from '../../../models/verification/verification.model';
import { PersonaData } from '../../../models/chatbot-config.model';
import { ClassificationsOutput } from '../../../models/verification/classification.model';
import { ReviewStepTarget } from '../chatbot-config-flow/chatbot-review-step/chatbot-review-step.component';

describe('VerificationContainerComponent', () => {
  let component: VerificationContainerComponent;
  let fixture: ComponentFixture<VerificationContainerComponent>;

  let mockVerificationService: jasmine.SpyObj<VerificationService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockChatbotService: jasmine.SpyObj<InfluencerChatbotService>;
  let mockCategoryService: jasmine.SpyObj<ChatbotCategoryService>;
  let mockClassificationsService: jasmine.SpyObj<ChatbotClassificationsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToast: jasmine.SpyObj<ToastService>;

  const mockVerificationResponse: VerificationRequestResponse = {
    verificationToken: 'token-abc',
    expirationDateAt: '2026-12-31T00:00:00Z',
    message: null,
  };

  const mockPersonaData: PersonaData = {
    name: 'TestBot',
    description: 'A test bot',
    talkLikeMe: false,
    fetchChannel: true,
    tone: 'friendly',
    verbosity: 'balanced',
    formality: 'neutral',
    fetchYoutubeProfilePicture: true,
  };

  beforeEach(async () => {
    mockVerificationService = jasmine.createSpyObj('VerificationService', [
      'requestVerification',
      'confirmVerification',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['updateUserRole']);
    mockChatbotService = jasmine.createSpyObj('InfluencerChatbotService', [
      'getChatbotConfig',
      'createConfig',
      'assignChatbotCategory',
      'addSystemClassifications',
      'createCustomMessageClass',
    ]);
    mockCategoryService = jasmine.createSpyObj('ChatbotCategoryService', ['getCategories']);
    mockClassificationsService = jasmine.createSpyObj('ChatbotClassificationsService', ['getMessageClasses']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToast = jasmine.createSpyObj('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        VerificationContainerComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: VerificationService, useValue: mockVerificationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: InfluencerChatbotService, useValue: mockChatbotService },
        { provide: ChatbotCategoryService, useValue: mockCategoryService },
        { provide: ChatbotClassificationsService, useValue: mockClassificationsService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToast },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationContainerComponent);
    component = fixture.componentInstance;
    component.state = 'CHANNEL_VERIFICATION';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('stepForward() / stepBack()', () => {
    it('should increment currentStep on stepForward()', () => {
      component.currentStep = 0;
      component.stepForward();
      expect(component.currentStep).toBe(1);
    });

    it('should decrement currentStep on stepBack()', () => {
      component.currentStep = 2;
      component.stepBack();
      expect(component.currentStep).toBe(1);
    });
  });

  describe('onBack()', () => {
    it('should call stepBack and clear errorMessage', () => {
      component.currentStep = 2;
      component.errorMessage = 'Some error';
      component.onBack();
      expect(component.currentStep).toBe(1);
      expect(component.errorMessage).toBe('');
    });
  });

  describe('onChannelSubmit()', () => {
    it('should set isLoading and call requestVerification', () => {
      mockVerificationService.requestVerification.and.returnValue(of(mockVerificationResponse as any));
      component.onChannelSubmit('https://youtube.com/channel/test');
      expect(component.channelUrl).toBe('https://youtube.com/channel/test');
      expect(mockVerificationService.requestVerification).toHaveBeenCalledWith('https://youtube.com/channel/test');
    });
    
    it('should set verificationToken, expirationDate, and advance step on success', () => {
      mockVerificationService.requestVerification.and.returnValue(of(mockVerificationResponse as any));
      component.currentStep = 0;
      component.onChannelSubmit('https://youtube.com/channel/test');
      expect(component.verificationToken).toBe('token-abc');
      expect(component.expirationDate).toBe('2026-12-31T00:00:00Z');
      expect(component.currentStep).toBe(1);
      expect(component.isLoading).toBeFalse();
    });

    it('should call toast.error on failure', () => {
      mockVerificationService.requestVerification.and.returnValue(
        throwError(() => ({ error: { error: 'Channel not found' } }))
      );
      component.onChannelSubmit('bad-url');
      expect(mockToast.error).toHaveBeenCalledWith('Channel not found');
      expect(component.isLoading).toBeFalse();
    });

    it('should use fallback error message when error has no message', () => {
      mockVerificationService.requestVerification.and.returnValue(
        throwError(() => ({}))
      );
      component.onChannelSubmit('bad-url');
      expect(mockToast.error).toHaveBeenCalledWith('Failed to request verification.');
    });
  });

  describe('handleOnChannelSubmitSuccess()', () => {
    it('should set token, expirationDate, set isLoading false, and advance step', () => {
      component.isLoading = true;
      component.currentStep = 0;
      component.handleOnChannelSubmitSuccess(mockVerificationResponse);
      expect(component.isLoading).toBeFalse();
      expect(component.verificationToken).toBe('token-abc');
      expect(component.expirationDate).toBe('2026-12-31T00:00:00Z');
      expect(component.currentStep).toBe(1);
    });
  });

  describe('onTokenAdded()', () => {
    it('should advance currentStep', () => {
      component.currentStep = 1;
      component.onTokenAdded();
      expect(component.currentStep).toBe(2);
    });
  });

  describe('onVerificationStart()', () => {
    it('should set isVerifying and call confirmVerification', () => {
      mockVerificationService.confirmVerification.and.returnValue(of(null));
      component.onVerificationStart();
      expect(mockVerificationService.confirmVerification).toHaveBeenCalled();
    });

    it('should update user role, advance step, and set isVerifying to false on success', () => {
      mockVerificationService.confirmVerification.and.returnValue(of(null));
      component.currentStep = 2;
      component.onVerificationStart();
      expect(component.isVerifying).toBeFalse();
      expect(mockAuthService.updateUserRole).toHaveBeenCalledWith('INFLUENCER');
      expect(component.currentStep).toBe(3);
    });

    it('should call toast.error and reset isVerifying on failure', () => {
      mockVerificationService.confirmVerification.and.returnValue(
        throwError(() => ({ error: { error: 'Token mismatch' } }))
      );
      component.onVerificationStart();
      expect(mockToast.error).toHaveBeenCalledWith('Token mismatch');
      expect(component.isVerifying).toBeFalse();
    });

    it('should use fallback message when verification error has no message', () => {
      mockVerificationService.confirmVerification.and.returnValue(throwError(() => ({})));
      component.onVerificationStart();
      expect(mockToast.error).toHaveBeenCalledWith('Verification failed. Ensure token is correct.');
    });
  });

  describe('onCompleteChannelVerification()', () => {
    it('should emit CHATBOT_SETUP, reset currentStep to 0, and set isLoading false', () => {
      const emitSpy = spyOn(component.stateChange, 'emit');
      component.currentStep = 3;
      component.onCompleteChannelVerification();
      expect(emitSpy).toHaveBeenCalledWith('CHATBOT_SETUP');
      expect(component.currentStep).toBe(0);
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('fetchAvatarUrl()', () => {
    it('should update chatbotConfig.avatarUrl with value from getChatbotConfig', () => {
      const resp: ChatbotConfigResponse = { configInfo: { configId: 1, avatarUrl: 'https://img.example.com/avatar.jpg' } };
      mockChatbotService.getChatbotConfig.and.returnValue(of(resp));
      component.fetchAvatarUrl();
      expect(component.chatbotConfig.avatarUrl).toBe('https://img.example.com/avatar.jpg');
    });

    it('should not throw when getChatbotConfig returns no avatarUrl', () => {
      mockChatbotService.getChatbotConfig.and.returnValue(of({}));
      expect(() => component.fetchAvatarUrl()).not.toThrow();
    });
  });

  describe('onPersonaSubmit()', () => {
    it('should update chatbotConfig.personaData and advance step', () => {
      mockChatbotService.getChatbotConfig.and.returnValue(of({}));
      component.currentStep = 0;
      component.onPersonaSubmit(mockPersonaData);
      expect(component.chatbotConfig.personaData).toEqual(mockPersonaData);
      expect(component.currentStep).toBe(1);
    });

    it('should call fetchAvatarUrl', () => {
      mockChatbotService.getChatbotConfig.and.returnValue(of({}));
      spyOn(component, 'fetchAvatarUrl');
      component.onPersonaSubmit(mockPersonaData);
      expect(component.fetchAvatarUrl).toHaveBeenCalled();
    });
  });

  describe('onWelcomeMessageSubmit()', () => {
    it('should set welcomeMessage and advance step', () => {
      component.currentStep = 1;
      component.onWelcomeMessageSubmit('Hello, welcome!');
      expect(component.chatbotConfig.welcomeMessage).toBe('Hello, welcome!');
      expect(component.currentStep).toBe(2);
    });
  });

  describe('onCategorySubmit()', () => {
    it('should set category, selectedCategoryName, and advance step', () => {
      component.currentStep = 2;
      component.onCategorySubmit({ id: 5, name: 'Gaming' });
      expect(component.chatbotConfig.category).toBe('5');
      expect(component.selectedCategoryName).toBe('Gaming');
      expect(component.currentStep).toBe(3);
    });
  });

  describe('onClassificationsSubmit()', () => {
    it('should update classifications in chatbotConfig and advance step', () => {
      const data: ClassificationsOutput = {
        systemClassIds: [1, 2],
        customClassNames: ['Custom1'],
        systemClassNames: ['General', 'Support'],
      };
      component.currentStep = 3;
      component.onClassificationsSubmit(data);
      expect(component.chatbotConfig.systemClassIds).toEqual([1, 2]);
      expect(component.chatbotConfig.customClassNames).toEqual(['Custom1']);
      expect(component.selectedSystemClassNames).toEqual(['General', 'Support']);
      expect(component.currentStep).toBe(4);
    });

    it('should default selectedSystemClassNames to [] when systemClassNames is absent', () => {
      const data: ClassificationsOutput = {
        systemClassIds: [],
        customClassNames: [],
        systemClassNames: undefined,
      };
      component.onClassificationsSubmit(data);
      expect(component.selectedSystemClassNames).toEqual([]);
    });
  });

  describe('onEditStep()', () => {
    it('should set currentStep to persona index (0) and clear errorMessage', () => {
      component.currentStep = 4;
      component.errorMessage = 'Some error';
      component.onEditStep('persona' as ReviewStepTarget);
      expect(component.currentStep).toBe(0);
      expect(component.errorMessage).toBe('');
    });

    it('should set currentStep to category index (2)', () => {
      component.onEditStep('category' as ReviewStepTarget);
      expect(component.currentStep).toBe(2);
    });

    it('should set currentStep to classifications index (3)', () => {
      component.onEditStep('classifications' as ReviewStepTarget);
      expect(component.currentStep).toBe(3);
    });
  });

  describe('onConfirmSetup() → createConfig → assignCategory → handleClassifications → handleSuccess', () => {
    beforeEach(() => {
      component.chatbotConfig = {
        personaData: mockPersonaData,
        welcomeMessage: 'Hello!',
        category: '3',
        systemClassIds: [1],
        customClassNames: ['MyClass'],
      };
    });

    it('should call createConfig on onConfirmSetup()', () => {
      mockChatbotService.createConfig.and.returnValue(of(null));
      mockChatbotService.assignChatbotCategory.and.returnValue(of(null));
      mockChatbotService.addSystemClassifications.and.returnValue(of(null));
      mockChatbotService.createCustomMessageClass.and.returnValue(of(null));

      spyOn(component, 'createConfig');
      component.onConfirmSetup();
      expect(component.isSavingConfig).toBeTrue();
      expect(component.createConfig).toHaveBeenCalled();
    });

    it('should navigate to /dashboard and emit DASHBOARD on full success chain', () => {
      mockChatbotService.createConfig.and.returnValue(of(null));
      mockChatbotService.assignChatbotCategory.and.returnValue(of(null));
      mockChatbotService.addSystemClassifications.and.returnValue(of(null));
      mockChatbotService.createCustomMessageClass.and.returnValue(of(null));

      const emitSpy = spyOn(component.stateChange, 'emit');
      component.onConfirmSetup();

      expect(mockToast.success).toHaveBeenCalledWith('Chatbot configured successfully! Welcome to your dashboard.');
      expect(emitSpy).toHaveBeenCalledWith('DASHBOARD');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(component.isSavingConfig).toBeFalse();
    });

    it('should send correctly-cased payload in createConfig()', () => {
      mockChatbotService.createConfig.and.returnValue(of(null));
      mockChatbotService.assignChatbotCategory.and.returnValue(of(null));
      mockChatbotService.addSystemClassifications.and.returnValue(of(null));
      mockChatbotService.createCustomMessageClass.and.returnValue(of(null));

      component.createConfig();

      expect(mockChatbotService.createConfig).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'TestBot',
        tone: 'FRIENDLY',
        verbosity: 'BALANCED',
        formality: 'NEUTRAL',
      }));
    });

    it('should call toast.error and reset isSavingConfig when createConfig fails', () => {
      mockChatbotService.createConfig.and.returnValue(
        throwError(() => ({ error: { error: 'Config error' } }))
      );
      component.onConfirmSetup();
      expect(mockToast.error).toHaveBeenCalledWith('Config error');
      expect(component.isSavingConfig).toBeFalse();
    });

    it('should call toast.error when assignCategory fails', () => {
      mockChatbotService.createConfig.and.returnValue(of(null));
      mockChatbotService.assignChatbotCategory.and.returnValue(
        throwError(() => ({ error: { error: 'Category error' } }))
      );
      component.onConfirmSetup();
      expect(mockToast.error).toHaveBeenCalledWith('Category error');
    });

    it('should call toast.error when handleClassifications forkJoin fails', () => {
      mockChatbotService.createConfig.and.returnValue(of(null));
      mockChatbotService.assignChatbotCategory.and.returnValue(of(null));
      mockChatbotService.addSystemClassifications.and.returnValue(
        throwError(() => ({ error: { error: 'Classification error' } }))
      );
      mockChatbotService.createCustomMessageClass.and.returnValue(of(null));
      component.onConfirmSetup();
      expect(mockToast.error).toHaveBeenCalledWith('Classification error');
    });
  });

  describe('handleError()', () => {
    it('should reset isSavingConfig, isLoading, isVerifying and call toast.error', () => {
      component.isSavingConfig = true;
      component.isLoading = true;
      component.isVerifying = true;
      component.handleError({ error: { error: 'Oops' } }, 'Fallback message');
      expect(component.isSavingConfig).toBeFalse();
      expect(component.isLoading).toBeFalse();
      expect(component.isVerifying).toBeFalse();
      expect(mockToast.error).toHaveBeenCalledWith('Oops');
    });

    it('should use fallback when error object has no nested message', () => {
      component.handleError({}, 'Fallback message');
      expect(mockToast.error).toHaveBeenCalledWith('Fallback message');
    });
  });

  describe('onStartOver()', () => {
    it('should reset all state to initial values', () => {
      component.currentStep = 3;
      component.channelUrl = 'https://example.com';
      component.verificationToken = 'tok';
      component.expirationDate = '2026-01-01';
      component.isVerifying = true;
      component.isLoading = true;
      component.errorMessage = 'Error!';

      component.onStartOver();

      expect(component.currentStep).toBe(0);
      expect(component.channelUrl).toBe('');
      expect(component.verificationToken).toBe('');
      expect(component.expirationDate).toBe('');
      expect(component.isVerifying).toBeFalse();
      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('');
    });
  });
});
