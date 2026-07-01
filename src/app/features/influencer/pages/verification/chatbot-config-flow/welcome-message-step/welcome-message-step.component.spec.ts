import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { WelcomeMessageStepComponent } from './welcome-message-step.component';

describe('WelcomeMessageStepComponent', () => {
  let component: WelcomeMessageStepComponent;
  let fixture: ComponentFixture<WelcomeMessageStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeMessageStepComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeMessageStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
