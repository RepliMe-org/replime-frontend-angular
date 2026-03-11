import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCompleteStepComponent } from './verification-complete-step.component';

describe('VerificationCompleteStepComponent', () => {
  let component: VerificationCompleteStepComponent;
  let fixture: ComponentFixture<VerificationCompleteStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationCompleteStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationCompleteStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
