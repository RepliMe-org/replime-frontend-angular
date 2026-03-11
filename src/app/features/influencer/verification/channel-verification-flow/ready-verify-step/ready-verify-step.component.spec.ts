import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyVerifyStepComponent } from './ready-verify-step.component';

describe('ReadyVerifyStepComponent', () => {
  let component: ReadyVerifyStepComponent;
  let fixture: ComponentFixture<ReadyVerifyStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyVerifyStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyVerifyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
