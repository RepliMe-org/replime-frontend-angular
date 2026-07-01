import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VerificationCompleteStepComponent } from './verification-complete-step.component';

describe('VerificationCompleteStepComponent', () => {
  let component: VerificationCompleteStepComponent;
  let fixture: ComponentFixture<VerificationCompleteStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VerificationCompleteStepComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationCompleteStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getChannelHandle()', () => {
    it('should extract the channel handle from a valid YouTube URL', () => {
      component.channelUrl = 'https://www.youtube.com/@Angular';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('@Angular');
    });

    it('should set an empty string when the URL does not contain a handle', () => {
      component.channelUrl = 'https://www.youtube.com/channel/UC123456';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('');
    });

    it('should handle an empty channel URL', () => {
      component.channelUrl = '';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('');
    });
  });

  describe('onSetUpChatBot()', () => {
    it('should emit the complete event', () => {
      spyOn(component.complete, 'emit');

      component.onSetUpChatBot();

      expect(component.complete.emit).toHaveBeenCalled();
    });
  });
});
