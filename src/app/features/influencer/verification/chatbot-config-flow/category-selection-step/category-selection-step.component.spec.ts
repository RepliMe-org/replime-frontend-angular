import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelectionStepComponent } from './category-selection-step.component';

describe('CategorySelectionStepComponent', () => {
  let component: CategorySelectionStepComponent;
  let fixture: ComponentFixture<CategorySelectionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySelectionStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySelectionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
