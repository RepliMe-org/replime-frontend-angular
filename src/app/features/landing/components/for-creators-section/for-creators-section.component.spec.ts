import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForCreatorsSectionComponent } from './for-creators-section.component';

describe('ForCreatorsSectionComponent', () => {
  let component: ForCreatorsSectionComponent;
  let fixture: ComponentFixture<ForCreatorsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForCreatorsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForCreatorsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
