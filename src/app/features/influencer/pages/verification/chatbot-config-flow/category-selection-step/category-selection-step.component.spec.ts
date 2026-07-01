import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { CategorySelectionStepComponent } from './category-selection-step.component';

describe('CategorySelectionStepComponent', () => {
  let component: CategorySelectionStepComponent;
  let fixture: ComponentFixture<CategorySelectionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySelectionStepComponent, HttpClientTestingModule, RouterModule.forRoot([])]
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
