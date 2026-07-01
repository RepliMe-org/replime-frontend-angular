import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserCellComponent } from './user-cell.component';

describe('UserCellComponent', () => {
  let component: UserCellComponent;
  let fixture: ComponentFixture<UserCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCellComponent, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
