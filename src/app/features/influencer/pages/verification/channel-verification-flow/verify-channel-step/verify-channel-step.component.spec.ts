import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VerifyChannelStepComponent } from './verify-channel-step.component';

describe('VerifyChannelStepComponent', () => {
  let component: VerifyChannelStepComponent;
  let fixture: ComponentFixture<VerifyChannelStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VerifyChannelStepComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyChannelStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isValidUrl()', () => {
    it('should return false when channelUrl is empty', () => {
      component.channelUrl = '';

      expect(component.isValidUrl()).toBeFalse();
    });

    it('should return true for a valid youtube handle URL', () => {
      component.channelUrl = 'https://www.youtube.com/@Angular';

      expect(component.isValidUrl()).toBeTrue();
    });

    it('should return true for a youtu.be URL', () => {
      component.channelUrl = 'https://youtu.be/abcdef';

      expect(component.isValidUrl()).toBeTrue();
    });

    it('should return false for an invalid URL', () => {
      component.channelUrl = 'https://google.com';

      expect(component.isValidUrl()).toBeFalse();
    });

    it('should ignore leading and trailing whitespace', () => {
      component.channelUrl = '   https://www.youtube.com/@Angular   ';

      expect(component.isValidUrl()).toBeTrue();
    });
  });

  describe('onSubmit()', () => {
    it('should emit the trimmed URL when valid and not loading', () => {
      spyOn(component.channelSubmit, 'emit');

      component.channelUrl = '  https://www.youtube.com/@Angular  ';
      component.isLoading = false;

      component.onSubmit();

      expect(component.channelSubmit.emit).toHaveBeenCalledWith(
        'https://www.youtube.com/@Angular',
      );
    });

    it('should not emit when URL is invalid', () => {
      spyOn(component.channelSubmit, 'emit');

      component.channelUrl = 'invalid-url';
      component.isLoading = false;

      component.onSubmit();

      expect(component.channelSubmit.emit).not.toHaveBeenCalled();
    });

    it('should not emit when loading', () => {
      spyOn(component.channelSubmit, 'emit');

      component.channelUrl = 'https://www.youtube.com/@Angular';
      component.isLoading = true;

      component.onSubmit();

      expect(component.channelSubmit.emit).not.toHaveBeenCalled();
    });

    it('should not emit when URL is empty', () => {
      spyOn(component.channelSubmit, 'emit');

      component.channelUrl = '';
      component.isLoading = false;

      component.onSubmit();

      expect(component.channelSubmit.emit).not.toHaveBeenCalled();
    });
  });
});
