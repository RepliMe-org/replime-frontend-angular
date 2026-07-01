import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { MessageClassificationStepComponent } from './message-classification-step.component';

describe('MessageClassificationStepComponent', () => {
  let component: MessageClassificationStepComponent;
  let fixture: ComponentFixture<MessageClassificationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageClassificationStepComponent, HttpClientTestingModule, RouterModule.forRoot([])]
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
