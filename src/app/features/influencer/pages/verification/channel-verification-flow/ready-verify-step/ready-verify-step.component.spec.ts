import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { ReadyVerifyStepComponent } from './ready-verify-step.component';

describe('ReadyVerifyStepComponent', () => {
  let component: ReadyVerifyStepComponent;
  let fixture: ComponentFixture<ReadyVerifyStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReadyVerifyStepComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadyVerifyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getChannelHandle()', () => {
    it('should extract channel handle from a valid YouTube URL', () => {
      component.channelUrl = 'https://www.youtube.com/@Angular';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('@Angular');
    });

    it('should set empty string when URL does not contain a handle', () => {
      component.channelUrl = 'https://www.youtube.com/channel/123456';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('');
    });

    it('should handle an empty URL', () => {
      component.channelUrl = '';

      component.getChannelHandle();

      expect(component.channelHandle).toBe('');
    });
  });

  describe('onVerifyClick()', () => {
    it('should emit verify event', () => {
      spyOn(component.verify, 'emit');

      component.onVerifyClick();

      expect(component.verify.emit).toHaveBeenCalled();
    });
  });

  describe('onBackClick()', () => {
    it('should emit back event', () => {
      spyOn(component.back, 'emit');

      component.onBackClick();

      expect(component.back.emit).toHaveBeenCalled();
    });
  });

  describe('onStartOverClick()', () => {
    it('should emit startOver event', () => {
      spyOn(component.startOver, 'emit');

      component.onStartOverClick();

      expect(component.startOver.emit).toHaveBeenCalled();
    });
  });
});
