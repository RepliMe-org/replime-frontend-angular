import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTokenStepComponent } from './add-token-step.component';

describe('AddTokenStepComponent', () => {
  let component: AddTokenStepComponent;
  let fixture: ComponentFixture<AddTokenStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTokenStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTokenStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
