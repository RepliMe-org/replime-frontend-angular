import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageClassificationStepComponent } from './message-classification-step.component';

describe('MessageClassificationStepComponent', () => {
  let component: MessageClassificationStepComponent;
  let fixture: ComponentFixture<MessageClassificationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageClassificationStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageClassificationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
