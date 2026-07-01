import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AddTokenStepComponent } from './add-token-step.component';

describe('AddTokenStepComponent', () => {
  let component: AddTokenStepComponent;
  let fixture: ComponentFixture<AddTokenStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddTokenStepComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTokenStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jasmine
          .createSpy('writeText')
          .and.returnValue(Promise.resolve()),
      },
      configurable: true,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('copyToken()', () => {
    it('should copy the token to the clipboard', () => {
      component.verificationToken = 'abc123';

      component.copyToken();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('abc123');
    });

    it('should set tokenCopied to true immediately', () => {
      component.copyToken();

      expect(component.tokenCopied).toBeTrue();
    });

    it('should reset tokenCopied after 2 seconds', fakeAsync(() => {
      component.copyToken();

      expect(component.tokenCopied).toBeTrue();

      tick(2000);

      expect(component.tokenCopied).toBeFalse();
    }));
  });

  describe('getChannelHandle()', () => {
    it('should extract the channel handle from the URL', () => {
      component.channelUrl = 'https://www.youtube.com/@Angular';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('@Angular');
    });

    it('should return empty string when URL has no handle', () => {
      component.channelUrl = 'https://www.youtube.com/channel/123';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('');
    });

    it('should handle an empty URL', () => {
      component.channelUrl = '';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('');
    });
  });

  describe('getFormattedExpirationDate()', () => {
    it('should return empty string when expirationDate is empty', () => {
      component.expirationDate = '';

      expect(component.getFormattedExpirationDate()).toBe('');
    });

    it('should return a formatted date', () => {
      component.expirationDate = '2025-01-15T14:30:00Z';

      const result = component.getFormattedExpirationDate();

      expect(result).toContain('2025');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('onTokenAdded()', () => {
    it('should emit tokenAdded', () => {
      spyOn(component.tokenAdded, 'emit');

      component.onTokenAdded();

      expect(component.tokenAdded.emit).toHaveBeenCalled();
    });
  });

  describe('instructions', () => {
    it('should contain four instructions', () => {
      expect(component.instructions.length).toBe(4);
    });

    it('should have the expected first instruction', () => {
      expect(component.instructions[0].title).toBe(
        'Go to your YouTube channel',
      );
    });
  });
});
