import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationContainerComponent } from './verification-container.component';

describe('VerificationContainerComponent', () => {
  let component: VerificationContainerComponent;
  let fixture: ComponentFixture<VerificationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
