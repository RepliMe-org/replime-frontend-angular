import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionsCellComponent } from './user-actions-cell.component';

describe('UserActionsCellComponent', () => {
  let component: UserActionsCellComponent;
  let fixture: ComponentFixture<UserActionsCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActionsCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActionsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
