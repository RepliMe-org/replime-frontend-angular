import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaSetupStepComponent } from './persona-setup-step.component';

describe('PersonaSetupStepComponent', () => {
  let component: PersonaSetupStepComponent;
  let fixture: ComponentFixture<PersonaSetupStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaSetupStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaSetupStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
