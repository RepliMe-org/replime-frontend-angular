import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClassificationsComponent } from './admin-classifications.component';

describe('AdminClassificationsComponent', () => {
  let component: AdminClassificationsComponent;
  let fixture: ComponentFixture<AdminClassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClassificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
