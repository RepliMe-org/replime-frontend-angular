import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaSetupStepComponent } from './persona-setup-step.component';
import { PersonaData } from '../../../../models/chatbot-config.model';

describe('PersonaSetupStepComponent', () => {
  let component: PersonaSetupStepComponent;
  let fixture: ComponentFixture<PersonaSetupStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaSetupStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaSetupStepComponent);
    component = fixture.componentInstance;
  });

  function initComponent(personaData?: PersonaData) {
    component.personaData = personaData;
    fixture.detectChanges();
  }

  it('should create', () => {
    initComponent();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should initialize empty form when no personaData is provided', () => {
      initComponent();

      expect(component.personaForm.get('name')?.value).toBe('');
      expect(component.personaForm.get('description')?.value).toBe('');
      expect(component.personaForm.get('talkLikeMe')?.value).toBeFalse();
      expect(component.personaForm.get('fetchChannel')?.value).toBeFalse();
      expect(component.personaForm.get('tone')?.value).toBe('friendly');
      expect(component.personaForm.get('verbosity')?.value).toBe('balanced');
      expect(component.personaForm.get('formality')?.value).toBe('neutral');
    });

    it('should populate the form from personaData', () => {
      const persona: PersonaData = {
        name: 'John',
        description: 'Developer',
        talkLikeMe: false,
        fetchChannel: true,
        tone: 'professional',
        verbosity: 'verbose',
        formality: 'formal',
        fetchYoutubeProfilePicture: true,
      };

      initComponent(persona);

      expect(component.personaForm.getRawValue()).toEqual({
        name: 'John',
        description: 'Developer',
        talkLikeMe: false,
        fetchChannel: true,
        tone: 'professional',
        verbosity: 'verbose',
        formality: 'formal',
      });
    });

    it('should disable tone and formality when talkLikeMe is true', () => {
      initComponent({
        name: 'John',
        description: 'Developer',
        talkLikeMe: true,
        fetchChannel: false,
        tone: 'friendly',
        verbosity: 'balanced',
        formality: 'neutral',
        fetchYoutubeProfilePicture: true,
      });

      expect(component.personaForm.get('tone')?.disabled).toBeTrue();
      expect(component.personaForm.get('formality')?.disabled).toBeTrue();
    });
  });

  describe('talkLikeMe()', () => {
    it('should return talkLikeMe value', () => {
      initComponent();

      component.personaForm.patchValue({
        talkLikeMe: true,
      });

      expect(component.talkLikeMe()).toBeTrue();
    });
  });

  describe('fetchChannel()', () => {
    it('should return fetchChannel value', () => {
      initComponent();

      component.personaForm.patchValue({
        fetchChannel: true,
      });

      expect(component.fetchChannel()).toBeTrue();
    });
  });

  describe('toggleTalkLikeMe()', () => {
    it('should enable talkLikeMe and disable controls', () => {
      initComponent();

      component.toggleTalkLikeMe();

      expect(component.talkLikeMe()).toBeTrue();
      expect(component.personaForm.get('tone')?.disabled).toBeTrue();
      expect(component.personaForm.get('formality')?.disabled).toBeTrue();
    });

    it('should disable talkLikeMe and enable controls', () => {
      initComponent();

      component.personaForm.patchValue({
        talkLikeMe: true,
      });

      component.personaForm.get('tone')?.disable();
      component.personaForm.get('formality')?.disable();

      component.toggleTalkLikeMe();

      expect(component.talkLikeMe()).toBeFalse();
      expect(component.personaForm.get('tone')?.enabled).toBeTrue();
      expect(component.personaForm.get('formality')?.enabled).toBeTrue();
    });
  });

  describe('toggleFetchChannel()', () => {
    it('should toggle fetchChannel', () => {
      initComponent();

      expect(component.fetchChannel()).toBeFalse();

      component.toggleFetchChannel();
      expect(component.fetchChannel()).toBeTrue();

      component.toggleFetchChannel();
      expect(component.fetchChannel()).toBeFalse();
    });
  });

  describe('onContinue()', () => {
    it('should emit persona when form is valid', () => {
      initComponent();

      spyOn(component.personaSubmit, 'emit');

      component.personaForm.patchValue({
        name: 'John',
        description: 'Developer',
      });

      component.onContinue();

      expect(component.personaSubmit.emit).toHaveBeenCalledWith(
        component.personaForm.getRawValue(),
      );
    });

    it('should not emit when form is invalid', () => {
      initComponent();

      spyOn(component.personaSubmit, 'emit');

      component.personaForm.patchValue({
        name: '',
        description: '',
      });

      component.onContinue();

      expect(component.personaSubmit.emit).not.toHaveBeenCalled();
    });
  });

  describe('isFormValid()', () => {
    it('should return false when form is invalid', () => {
      initComponent();

      expect(component.isFormValid()).toBeFalse();
    });

    it('should return true when form is valid', () => {
      initComponent();

      component.personaForm.patchValue({
        name: 'John',
        description: 'Developer',
      });

      expect(component.isFormValid()).toBeTrue();
    });
  });
});
