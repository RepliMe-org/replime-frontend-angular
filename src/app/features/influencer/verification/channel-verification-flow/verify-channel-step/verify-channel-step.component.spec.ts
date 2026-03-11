import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyChannelStepComponent } from './verify-channel-step.component';

describe('VerifyChannelStepComponent', () => {
  let component: VerifyChannelStepComponent;
  let fixture: ComponentFixture<VerifyChannelStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyChannelStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyChannelStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
